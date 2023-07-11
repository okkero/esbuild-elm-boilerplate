import esbuild from 'esbuild';
import htmlPlugin from '@chialab/esbuild-plugin-html';
import elmPlugin from 'esbuild-plugin-elm';
import {sassPlugin} from 'esbuild-sass-plugin';
import fs from 'fs/promises';

const serve = process.argv.includes('--serve');
const prod = process.argv.includes('--prod');
const host = '0.0.0.0';
const port = 8080;

let outdir;
if (serve) {
    outdir = 'dist/serve';
} else if (prod) {
    outdir = 'dist/prod';
} else {
    outdir = 'dist/debug';
}

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
        entryPoints: ['src/index.html'],
        assetNames: serve ? '[name]' : 'assets/[name]-[hash]',
        chunkNames: serve ? '[ext]/[name]' : '[ext]/[name]-[hash]',
        bundle: true,
        outdir,
        minify: prod,
        plugins: [
            htmlPlugin(),
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
        const context = await esbuild.context(buildOptions);
        await context.serve({
            servedir: outdir,
            host,
            port,
        });

        console.log(`Serving on http://${host}:${port}/`);
    } else {
        await esbuild.build(buildOptions);
    }
}

build().catch(e => {
    console.error(e);
    process.exit(1);
});
