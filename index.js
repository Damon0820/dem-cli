#!/usr/bin/env node

const { program } = require('commander');
const download = require('download-github-repo')
const fs = require('fs')
const exists = require('fs').existsSync
const ora = require('ora');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const chalk = require('chalk');

const templates = {
  webpack: {
    url: 'Damon0820/vue-project-template#main',
    desc: '基于webpack，vue的项目模板',
  }
}

program.version('0.0.1');

// program
//   .option('-d, --debug', 'output extra debugging')
//   .option('-s, --small', 'small pizza size')
//   .option('-p, --pizza-type <type...>', 'flavour of pizza');
// const options = program.opts();
// if (options.debug) console.log(options);
// console.log(program.args);
// // console.log('pizza details:');
// if (options.small) console.log('- small pizza size');
// if (options.pizzaType) console.log(`- ${options.pizzaType}`);

// // 通过绑定处理函数实现命令（这里的指令描述为放在`.command`中）
// // 返回新生成的命令（即该子命令）以供继续配置
// program
//   .command('clone <source> [destination]')
//   .description('clone a repository into a newly created directory')
//   .action((source, destination) => {
//     console.log('clone command called');
//     console.log(source);
//   });

program
  .command('create <templateName> <projectName>')
  .description('create a repository by template')
  .action((templateName, projectName) => {
    console.log('create: ' + templateName + '-' + projectName);
    console.log(process.argv)
    downloadAndGenerate(templates[templateName], projectName);
  })

program
  .command('list')
  .description('list all availble template')
  .action((template, projectName) => {
    console.log('template webpack');
    console.log('template xx');
    console.log('template xx2');
  })



program.parse(process.argv);


/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

 function downloadAndGenerate (template, projectName) {
  const spinner = ora('downloading template')
  spinner.start()
  // 下载模版
  download(template.url, projectName, err => {
    if (err) {
      spinner.fail(chalk.red('下载模版失败了'));
    } else {
      spinner.succeed(chalk.green('下载模版成功'));
      generate(projectName);
    }
  })
  // generate(projectName);
  
}

function generate(projectName) {
  inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'input your project name',
    },
    {
      type: 'input',
      name: 'description',
      message: 'input your project description',
    },
    {
      type: 'input',
      name: 'author',
      message: 'input author',
    },
    {
      type: 'confirm',
      name: 'router',
      message: 'use vue-router?',
    },
  ])
  .then(answers => {
    const {name, description, author} = answers;
    console.log(answers);
    const jsonPath = `${projectName}/package.json`
    const temStr = fs.readFileSync(jsonPath, 'UTF-8')
    console.log(temStr);
    const template = handlebars.compile(temStr)
    const result = template(answers);
    fs.writeFileSync(jsonPath, result)
    console.log(chalk.green('初始化模版成功'));
  })
}

