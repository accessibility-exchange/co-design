"use strict";

const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

module.exports = {
    async onPostBuild(options) {
        const {
            inputs: { manifestFile },
            constants: { PUBLISH_DIR },
            utils: { build, run, status }
        } = options;

        const manifestPath = path.join(PUBLISH_DIR, manifestFile);

        if (!fs.existsSync(manifestPath)) {
            build.failPlugin(
                `The specified Pandoc manifest file, ${manifestPath}, could not be found. Please verify that the manifest file exists in your site's publish directory.`
            );
        }

        const data = await readFile(manifestPath, "utf8");
        let manifest;

        try {
            manifest = JSON.parse(data);
        } catch (error) {
            build.failPlugin(`${error} (${manifestPath})`);
        }

        let i = 0;

        for (const item of manifest) {
            i++;
            await run.command(`pandoc ${item.input} -f ${item.inputFormat} -t ${item.outputFormat} -o ${item.output}`);
        }

        status.show({summary: `Success! ${i} files converted with Pandoc.`});
    }
};
