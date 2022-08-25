const ConfigHandler = require("../../src/components/ConfigHandler");
const FlowProcessor = require("../../src/components/FlowProcessor");
const GBD = require("../../src/components/GBD");
const Preprocessor = require("../../src/components/Preprocessor");
const TemplateEngine = require("../../src/components/TemplateEngine");
const { parseTree, BFS } = require("../../src/helpers/TreeHelper");

describe("SourceToSink ground-truth generation test", () => {
  test("BasicTemplate ImeiSource SmsSink", () => {
    const tmc = "BasicTemplate ImeiSource SmsSink";
    const expectedResult = [true];
    simplifiedTestRunner(tmc, expectedResult);
  });

  test("BasicTemplate ImeiSource RandomIfElseBridge ( DatacontainerBridge LogSink ) ( LogSink )", () => {
    const tmc = "BasicTemplate ImeiSource RandomIfElseBridge ( DatacontainerBridge LogSink ) ( LogSink )";
    const expectedResult = [false, true];
    simplifiedTestRunner(tmc, expectedResult);
  });

  test("BasicTemplate ImeiSource SmsSink SimpleUnreachableBridge SmsSink SimpleUnreachableBridge", () => {
    const tmc = "BasicTemplate ImeiSource SmsSink SimpleUnreachableBridge SmsSink SimpleUnreachableBridge";
    const expectedResult = [true, false];
    simplifiedTestRunner(tmc, expectedResult);
  });

  test("BasicTemplate ImeiSource ImeiSource ImeiSource SmsSink", () => {
    const tmc = "BasicTemplate ImeiSource ImeiSource ImeiSource SmsSink";
    const expectedResult = [false, false, true];
    simplifiedTestRunner(tmc, expectedResult);
  });

  test("BasicTemplate ImeiSource RandomIfElseBridge ( ImeiSource SmsSink ) ( SmsSink )", () => {
    const tmc = "BasicTemplate ImeiSource RandomIfElseBridge ( ImeiSource SmsSink ) ( SmsSink )";
    const expectedResult = [false, true, true];
    simplifiedTestRunner(tmc, expectedResult);
  });
});

const simplifiedTestRunner = (tmc, expectedResult) => {
    const result = generateStSGroundTruth(tmc);
    const simplifiedResult = simplifyResults(result);
    expect(simplifiedResult).toEqual(expectedResult);
};

const generateStSGroundTruth = (tmcString) => {
  new ConfigHandler().init("config.json");
  const gbd = new GBD();

  // load template from TMC
  const tmc = tmcString.split(/\s+|(\(|\))/g).filter((elem) => elem);
  const templateName = tmc.shift();
  const template = gbd._loadTemplate(templateName);

  // initialize preprocessor and preprocess template
  const pre = new Preprocessor();
  const processedTemplate = pre.preprocessTemplate(template, false);
  const te = new TemplateEngine(processedTemplate);

  // parse, load and preprocess modules from TMC
  const moduleTree = parseTree(tmc);
  BFS(moduleTree, (module, id) =>
    gbd._processModule(pre, te, false, module, id)
  );

  // process and generate taint flows for ground-truth
  const fp = new FlowProcessor(processedTemplate);
  fp.processFlows(moduleTree);
  const sourceSinkConnections = fp.getSourceSinkConnections(moduleTree);
  return sourceSinkConnections;
};

const simplifyResults = connections => {
    return connections.map(connection => connection.to.leaking);
};
