module.exports = function (grunt) {
    //配置参数
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
                stripBanners: true
            },
            index_index: {
                src: [
                    "src/js/sc/index.js"
                ],
                dest: 'js/sc/index.js'
            },
            index_import: {
                src: [
                    "src/js/sc/import.js"
                ],
                dest: 'js/sc/import.js'
            },
            index_notPayCustomer: {
                src: [
                    "src/js/sc/notPayCustomers.js"
                ],
                dest: 'js/sc/notPayCustomers.js'
            },
            index_search: {
                src: [
                    "src/js/sc/search.js"
                ],
                dest: 'js/sc/search.js'
            },
            house: {
                src: [
                    "src/js/sc/house/_config.js",
                    "src/js/sc/house/_info.js",
                    "src/js/sc/house/_split.js",
                    "src/js/sc/house/_status.js",
                    "src/js/sc/house/_history.js",
                    "src/js/sc/house/_subscribe.js",
                    "src/js/sc/house/_transfer.js",
                    "src/js/sc/house/_relation.js",
                    "src/js/sc/house/_main.js",
                    "src/js/sc/house/_houseMegerList.js"
                ],
                dest: "js/sc/house.js"
            },
            house_relation_map: {
                src: [
                    "src/js/sc/house/house_relation_map.js",
                ],
                dest: "js/sc/house_relation_map.js"
            },
            customer: {
                src: [
                    "src/js/sc/customer/userinfo.js"
                ],
                dest: "js/sc/customer.js"
            },
            customer_add: {
                src: [
                    "src/js/sc/customer/add.js"
                ],
                dest: "js/sc/customer_add.js"
            },
            customer_edit: {
                src: [
                    "src/js/sc/customer/edit.js"
                ],
                dest: "js/sc/customer_edit.js"
            },
            customer_list: {
                src: [
                    "src/js/sc/customer/list.js"
                ],
                dest: "js/sc/customer_list.js"
            },
            customer_bigeyes: {
                src: [
                    "src/js/sc/customer/bigeyes.js"
                ],
                dest: "js/sc/bigeyes.js"
            },
            customer_relation_map: {
                src: [
                    "src/js/sc/customer/customer_relation_map.js"
                ],
                dest: "js/sc/customer_relation_map.js"
            },
            carport: {
                src: [
                    "src/js/sc/carport/_config.js",
                    "src/js/sc/carport/_info.js",
                    "src/js/sc/carport/_relation.js",
                    "src/js/sc/carport/_history.js",
                    "src/js/sc/carport/_subscribe.js",
                    "src/js/sc/carport/_status.js",
                    "src/js/sc/carport/_main.js"
                ],
                dest: "js/sc/carport.js"
            },
            carport_customer_add: {
                src: [
                    "src/js/sc/carport_customer/add.js"
                ],
                dest: "js/sc/carport_customer_add.js"
            },
            workspace: {
                src: [
                    "src/js/sc/workspace/workspace.js"
                ],
                dest: 'js/sc/workspace.js'
            }
        },
        uglify: {
            options: {},
            dist: {
                files: {
                    'js/sc/house.min.js': 'js/sc/house.js',
                    'js/sc/customer.min.js': 'js/sc/customer.js',
                    'js/sc/customer_add.min.js': 'js/sc/customer_add.js',
                    'js/sc/customer_edit.min.js': 'js/sc/customer_edit.js',
                    'js/sc/customer_list.min.js': 'js/sc/customer_list.js',
                    'js/sc/carport.min.js': 'js/sc/carport.js',
                    'js/sc/index.min.js': 'js/sc/index.js',
                    'js/sc/import.min.js': 'js/sc/import.js',
                    'js/sc/search.min.js': 'js/sc/search.js',
                    'js/sc/notPayCustomers.min.js': 'js/sc/notPayCustomers.js',
                    'js/sc/workspace.min.js': 'js/sc/workspace.js',
                    'js/sc/bigeyes.min.js': 'js/sc/bigeyes.js'
                }
            }
        },
        sass: { // grunt-contrib-sass的事务定义
            options: {
                style: 'compressed', //以压缩模式编译css
                sourcemap: 'auto'  //设置不要配套输出map文件
            },
            dist: {
                files: {
                    'css/sc/main.css': 'src/scss/sc/main.scss',
                    'css/cc/main.css': 'src/scss/cc/main.scss',
                    'css/mc/main.css': 'src/scss/mc/main.scss',
                    'css/satis/main.css': 'src/scss/satis/main.scss',
                }
            }
        },
        watch: {  // grunt-contrib-watch的事务定义
            all: {
                files: ['src/scss/**/*.scss', 'src/js/**/*.js'],
                tasks: ['newer:sass', 'newer:concat', 'newer:uglify']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'target/vankecrm.webapp.static.tar.gz'
                },
                files: [
                    {src: ['css/**'], dest: '/', filter: 'isFile'}, // includes files in path
                    {src: ['js/**'], dest: '/'},
                    {src: ['font/**'], dest: '/'},
                    {src: ['img/**'], dest: '/'},
                    {src: ['lib/**'], dest: '/'}
                ]
            }
        }
    });
    //载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    // grunt.loadNpmTasks('grunt-newer');

    //注册任务
    // grunt.registerTask('default', ['newer:concat', 'newer:uglify', 'newer:sass', 'compress']);
    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'compress']);
}
