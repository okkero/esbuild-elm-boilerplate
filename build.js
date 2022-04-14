const esbuild = require('esbuild');
const elmPlugin = require('esbuild-plugin-elm');
const {sassPlugin} = require('esbuild-sass-plugin');
const fs = require('fs/promises');

const serve = process.argv.includes('--serve');
const watch = process.argv.includes('--watch');
const prod = process.argv.includes('--prod');
const host = '0.0.0.0';
const port = 8080;

process.env.NODE_ENV = prod ? 'production' : 'development';

async function build() {
    let localConfig;
    try {
        localConfig = await fs.readFile('config.local.json', {encoding: 'UTF8'});
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }

        localConfig = await fs.readFile('config.local.example.json', {encoding: 'UTF8'});
    }
    localConfig = JSON.parse(localConfig);

    const baseUrl = process.env.BASE_URL || localConfig.baseUrl;
    console.log(`baseUrl: ${baseUrl}`);

    const buildOptions = {
        entryPoints: ['src/index.js'],
        bundle: true,
        outdir: 'dist',
        loader: {
            '.html': 'text',
        },
        watch,
        minify: prod,
        plugins: [
            elmPlugin({
                optimize: prod,
                debug: !prod,
                clearOnWatch: false,
            }),
            sassPlugin(),
        ],
        define: {
            elmFlags: JSON.stringify({
                baseUrl,
            }),
        }
    };

    if (serve) {
        await esbuild.serve(
            {
                servedir: 'www',
                host,
                port,
            },
            {...buildOptions, outdir: 'www'}
        );

        console.log(`Serving on http://${host}:${port}/`);
    } else {
        await esbuild.build(buildOptions);
        await fs.copyFile('www/index.html', "dist/index.html");
    }
}

build().catch(e => {
    console.error(e);
    process.exit(1);
});
