const fs = require('fs');
const path = require('path');

// 删除 libs 目录
if (fs.existsSync('libs')) {
	fs.rmSync('libs', { recursive: true, force: true });
}

// 定义复制文件夹的函数
const copyDir = (sourcePath, targetPath) => {
	// 检查目标目录是否存在，如果不存在则创建
	if (!fs.existsSync(targetPath)) {
		fs.mkdirSync(targetPath, { recursive: true });
	}

	// 读取源目录中所有的条目
	const entries = fs.readdirSync(sourcePath, { withFileTypes: true });

	// 遍历所有条目
	for (let entry of entries) {
		const entryPath = path.join(sourcePath, entry.name);
		const targetEntryPath = path.join(targetPath, entry.name);

		if (entry.isDirectory()) {
			// 如果是目录，则递归调用 copyDir
			copyDir(entryPath, targetEntryPath);
		} else {
			// 如果是文件，则复制文件
			fs.copyFileSync(entryPath, targetEntryPath);
			console.log(`Copied file: ${entryPath} to ${targetEntryPath}`);
		}
	}
};

// 定义要复制的文件和目录列表
const files = [
	{ from: 'imgly/background-removal-data', to: 'imgly/background-removal-data', npm: false },
	{ from: 'monaco-editor/min', to: 'monaco-editor/min' },
	{ from: 'katex/dist', to: 'katex' }
];

// 循环遍历每个要复制的文件或目录
files.forEach((item) => {
	const sourcePath = item.npm === false ? item.from : path.join(__dirname, 'node_modules', item.from);
	const targetPath = path.join(__dirname, 'libs', item.to);

	// 如果是文件，使用fs.copyFileSync
	if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
		fs.copyFileSync(sourcePath, targetPath);
		console.log(`Copied file: ${sourcePath} to ${targetPath}`);
	}
	// 如果是文件夹，调用递归复制函数
	else {
		copyDir(sourcePath, targetPath);
		console.log(`Copied directory: ${sourcePath} to ${targetPath}`);
	}
});
