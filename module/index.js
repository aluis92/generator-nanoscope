"use strict";

var generators = require("yeoman-generator"),
    _ = require("lodash");

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);

        this.argument('name', { type: String, required: true });
    },
    prompting: function() {
        var done = this.async();
        this.prompt(
            {
                type: "list",
                name: "moduleType",
                message: "Select the module type that will be created.",
                choices: [
                    {
                        name: "Atom",
                        value: "atom"
                    },
                    {
                        name: "Molecule",
                        value: "molecule"
                    },
                    {
                        name: "Organism",
                        value: "organism"
                    }
                ],
            },
            function(resp) {
                this.moduleType = resp.moduleType;

                done();

            }.bind(this)
        );
    },
    writing: function() {
        var modulePrefix = function(type) {
            var prefix;

            if(type === "atom") {
                return "atm";
            }
            if(type === "molecule") {
                return "mol";
            }
            if(type === "organism") {
                return "org";
            }
        };

        this.fs.copyTpl(
            this.templatePath("_index.jade"),
            this.destinationPath("src/_modules/_" + this.moduleType + "s/" + _.kebabCase(this.name) + "/_index.jade"),
            {
                moduleName: _.kebabCase(this.name),
                modulePrefix: _.camelCase(modulePrefix(this.moduleType) + " " + this.name),
                moduleType: this.moduleType
            }
        );

        this.fs.copyTpl(
            this.templatePath("_main.sass"),
            this.destinationPath("src/_modules/_" + this.moduleType + "s/" + _.kebabCase(this.name) + "/_main.sass"),
            {
                moduleName: _.kebabCase(this.name),
                modulePrefix: _.camelCase(modulePrefix(this.moduleType) + " " + this.name),
                moduleType: this.moduleType
            }
        )

        var exec = require("child_process").exec;
        var cmd = "gulp modules";

        exec(cmd, function(error, stdout, stderr) {
          // command output is in stdout
        });
    },
    end: function() {

    }
});
