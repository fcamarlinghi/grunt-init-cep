module.exports =
{
    extension: {
        version: '{%= version %}',
        id: '{%= id %}',
        name: '{%= name %}',
        author_name: '{%= author_name %}',
        description: '{%= description %}',
        ui_access: 'You can run this extension by choosing<br><b>Window &gt; Extensions &gt; {%= name %}.</b>',
        mainPath: '{%= basename %}.html',
        scriptPath: 'extendscript/{%= basename %}.js',
    },

    builds: [
        // Adobe CC products
        {
            manifest: 'extension/manifest.cc.xml',
            products: {%= products %},
            source: 'src',
        },
    ],
};