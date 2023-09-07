## 功能简介
1. 这个VSCode插件允许你快速套一层组件，类似于Flutter中的自动包裹功能,和删除元素。无论你是在Vue文件还是HTML文件中工作，都可以使用这个插件来提高你的开发效率。

## 如何使用

1. 启用快速修复：在你的Vue或HTML文件中，当你想要套一层组件时，只需将光标放在要包裹的内容上。

2. 触发快速修复：使用快捷键或右键单击，选择“快速修复”选项，插件将会自动为你套一层组件,默认vscode快捷键为
  `cmd + .` or `ctrl + .`。

3. 可以在`setting.json`中寻找到`fix-tag`进行修改默认`tag`。


## 注意

1. 如果使用vscode默认`Linked Editing`在自定义tag中可能会有意想不到的冲突,推荐使用`Auto Rename Tag`进行搭配


支持的语言
Vue文件
HTML文件

