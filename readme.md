# GenBenchDroid
*GenBenchDroid* is a tool that is able to automatically generate Android applications that can be used as benchmark cases for the evaluation of Android taint analysis tools. 
Alongside the application, GenBenchDroid also generates a corresponding ground-truth that contains the expected analysis results for the generated application.

# Table of Contents
1. [Requirements](#requirements)
2. [Configuration](#configuration)
3. [Usage](#usage)
    1. [Manual mode](#manual-mode)
    2. [Fuzzing mode](#fuzzing-mode)
4. [Extension](#extension)
5. [Build Configuration](#build-configuration)
6. [List of all available command line parameters](#list-of-all-available-command-line-parameters)


## Requirements
The following applications need to be installed to use GenBenchDroid:
- [Node.js](https://nodejs.org/en/) (14.15 or higher)
- [Android SDK](https://developer.android.com/studio) (shipped with Android Studio)
- [Java Development Kit](https://www.oracle.com/de/java/technologies/javase-jdk15-downloads.html) 

## Configuration
GenBenchDroid has to be confiugred before its usage. 
This configuration has to be performed inside the **config.json** file inside GenBenchDroid's root directory. 
The directories containing the templates, modules and outputs have to be specified. 
Additionally, the desired project name, as well as the Android SDK directroy and the JDK directory have to be specified.

Example Configuration:
```json
{
    "templateDir": "templates",
    "moduleDir": "modules",
    "outputDir": "output",
    "projectName": "com.generated.app",
    "androidSdkDir": "path/to/Android/Sdk",
    "jdkDir": "path/to/jdk"
}
```

## Usage
To install all required dependencies, at first the following command has to be executed inside the directory containing GenBenchDroid:

```
npm install
```
<!--
On Linux distributions write permissions may have to be granted for the directory containing GenBenchDroid, as GenBenchDroid generates various files.
This can be achieved by using the following command inside the GenBenchDroid directory:

```
chmod -R 755 .
```
-->

### Usage Modes
GenBenchDroid offers two different usage modes: (1) the manual mode and (2) the fuzzing mode.

#### Manual Mode
The manual mode can be used to generate a fully specified benchmark case.
The following command can be used to generate a benchmark case:

```
node app --config <TMC>
```

\<TMC> is a placeholder that has to be replaced by the desired template + modules configuration.


Example configuration 1:
```
node app --config "BasicTemplate ImeiSource ArrayBridge SmsSink"
```
The desired configuration has be to surrounded by quotation marks and modules are separated by spaces.
Templates and modules are specified by providing their individual file names without the file extension.
The template has to be the first token inside the provided configuration.


Example configuration 2:
```
node app --config "BasicTemplate RandomIfElseBridge ( ArrayBridge ) ( SmsSink )"
```

This example contains a branch inside the generated benchmark case.
**RandomIfElseBridge** represents a branching module that requires two follow-up modules.
Each branch is indicated by a parenthesis pair.
The modules specified inside the first parenthesis pair are inserted into the first branch.
The modules specified inisde the second one are inserted into the second branch.
Each branch may contain arbitrarily many nested branches.

Generated benchmark cases and their corresponding ground-truths can be found in the directory that has been specified inside the **config.json** file.

#### Fuzzing Mode
GenBenchDroid's fuzzing mode can be used to generate random applications.
The fuzzing mode can be executed with the following command:
```
node app --fuzz
```

In order to specify desired properties for the randomly generated applications, the following parameters can additionally be used:

|Parameter |Functionality| Default |
| --------------------- | --------------------------------------------------------------------- | -- |
| --maxLength, --max    | Specifies the maximum amount of modules in the generated application  | 25 |
| --minLength, --min    | Specifies the minimum amount of modules in the generated application  | 0  |
| --taintflow, -t       | Guarantees a taint flow inside the generated benchmark case           |    |
| --contains            | Specifies (sub)strings that have to be part of the configuration      |    |
| --ignore              | Specifies (sub)strings that cannot be part of the configuration       |    |
| --priority, --priorities, <br/>--prioritize, --prio, -p | Specifies (sub)strings that have a higher priority to be selected for the generated application | |

Each of these parameters can also be combined with another.

Fuzzing Example 1:
```
node app -f --min 10 -t --contains ArrayBridge Sink
```
This command generates a random application containign at least ten modules that definitely contains a taint flow and also contains an **ArrayBridge** and another module with **Sink** in its name.

Fuzzing Example 2:
```
node app -f --max 10 --priority SmsSink 2 Reflection 5
```
This command generates a random application containing at most ten modules with the module **SmsSink** having a doubled chance and modules containing **Reflection** having a five times higher chance to be part of the application than all other modules.

## Extension
GenBenchDroid can easily be extended by creating new templates and modules.
In order to easily create a new template or module, the [GenBenchDroid-Editor](https://git.cs.uni-paderborn.de/sschott/genbenchdroid-editor) can be used.

Once the new template/module has been created, its file name has to be appended to the grammar in the file **grammar.</span>ne**, inside the **grammar** directory, at the right location.
A new template has to be appended to the **template** symbol, while a new module has to be appended to the **module** symbol.
If the new module does not branch the program flow, a **linear** symbol has to be appended.
If it is a branching module with two branches a **2Branches** module has to be appended.
This continues on with other amounts of branches.

Appending example:
```
...
template −> "BasicTemplate" | ... | "CreatedTemplate"
module   −> "ImeiSource" linear | ... | "CreatedLinearModule" linear |
```

After the grammar has been extended, the following command has to be executed to generate a new parser from the modified grammar:

```
node app --compile
```

Afterwards the newly created templates and modules can be used by GenBenchDroid.

## Build Configuration
GenBenchDroid uses [Gradle](https://gradle.org/) to build Android applications.
The configuration used by Gradle (Target Android SDK Version, etc.) can be changed in the to Gradle belonging files inside the **generated** directory.
More information about the configuration of Gradle can be found [here](https://developer.android.com/studio/build).

## List of all available command line parameters
|Parameter                      | Functionality |
| ----------------------------- | ------------- |
| --help                        | Opens up a help menu that shows a list of all available parameters and usage examples |
| --version                     | Shows the current version of GenBenchDroid |
| --compile                     | Compiles the **grammar.</span>ne** file into a parser |
| --configuration \<TMC>, <br/> --config \<TMC>, <br/> -c \<TMC> | Starts GenBenchDroid's manual mode and generates an application with the provided TMC (template + modules configuration) |
| --fuzz, -f                    | Starts GenBenchDroid's fuzzing mode and generates a random application consisting of templates/modules specified inside the grammar |

### Generation modification parameters
Each of these parameters can only be used in combination to the **--configuration** or **--fuzz** parameters:
|Parameter                      | Functionality |
| ----------------------------- | ------------- |
| --uncompiled                  | Instead of compiling the application, the application's source code is provided as output |
| --unobfuscated, <br/>-u            | The variable containing the sensitive data will not be obfuscated and always have the identifier **sensitiveData** |
| <nobr>--maxLength *number*,</nobr> <br/> --max *number* | **Fuzzing mode only** <br/> Specifies the maximum amount of modules in the generated application |
| <nobr>--minLength *number*,</nobr> <br/> --min *number* | **Fuzzing mode only** <br/> Specifies the minimum amount of modules in the generated application |
| --taintflow, <br/> -t | **Fuzzing mode only** <br/> Guarantees a taint flow inside the generated benchmark case |
| <nobr>--contains *string[]*</nobr> | **Fuzzing mode only** <br/> Specifies (sub)strings that have to be contained inside the TMC of the generated application |
| <nobr>--ignore *string[]*</nobr> | **Fuzzing mode only** <br/> Specifies (sub)strings that cannot be contained inside the TMC of the generated application |
| <nobr>--priority *string[]*,</nobr> <br/><nobr>--priorities *string[]*</nobr>, <br/><nobr>--prioritize *string[]*</nobr>, <br/>--prio *string[]*, <br/>-p *string[]* | **Fuzzing mode only** <br/> Specifies (sub)strings that have a higher priority to be selected for the generated application <br/> Priorities have to be specified in the following way: *string1 prio1 string2 prio2*, where each string has the following priority |

