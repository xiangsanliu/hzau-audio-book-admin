module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/music': {
                target: 'http://localhost/',
                changeOrigin: true,
                pathRewrite: {
                    '^/music': ''
                }
            }
        },
        port: 8080
    },
    pages: {
        index: {
            // entry for the page
            entry: 'src/main.js',
            // the source template
            template: 'public/index.html',
            // output as dist/index.html
            filename: 'index.html'
        }
    }
};
