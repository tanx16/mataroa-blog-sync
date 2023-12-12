import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import  { Api } from './api';

interface MataroaSettings {
    apiKey: string;
}

const DEFAULT_SETTINGS: MataroaSettings = {
    apiKey: 'ADD API KEY'
}

export default class MataroaPlugin extends Plugin {
    settings: MataroaSettings;
    api: Api;

    async onload() {
        await this.loadSettings();
        this.api = new Api(this.settings.apiKey);
        if (this.settings.apiKey == DEFAULT_SETTINGS.apiKey) {
            new Notice('API key missing!');
        }

        this.addRibbonIcon('cloud', 'Upload/update post', async (evt: MouseEvent) => {
            const file = this.app.workspace.getActiveFile();
            const text = await this.app.vault.read(file);
            if(!(file && text)) return;
            const filename = file.name.replace('.md', '');
            const getPostResult = await this.api.getPost(filename);
            if (getPostResult) {
                this.api.updatePost(filename, text);
                new Notice('Updated post!');
            }
            else {
                this.api.makeNewPost(filename, text);
                new Notice('Uploaded post!');
            }
        });

        this.addCommand({
            id: 'delete-current-post',
            name: 'Delete post',
            callback: () => {
                const filename = this.app.workspace.getActiveFile().name.replace('.md', '');
                this.api.deletePost(filename);
                new Notice('Deleted remote post.');
            }
        });

        this.addCommand({
            id: 'publish-current-post',
            name: 'Publish post',
            // Publishes at current date.
            callback: () => {
                const filename = this.app.workspace.getActiveFile().name.replace('.md', '');
                const publishPostResult = this.api.publishPost(filename);
                if (!publishPostResult) {
                    new Notice('Ran into error during publishing!');
                    return;
                }
                new Notice('Published remote post.');
            }
        });

        this.addCommand({
            id: 'pull-remote-post',
            name: 'Overwrite current file with remote post',
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                const filename = this.app.workspace.getActiveFile().name.replace('.md', '');
                const getPostResult = await this.api.getPost(filename);
                if (!getPostResult) {
                    new Notice('Cannot find remote post!');
                    return;
                }
                const endRange = {line: editor.lastLine(), ch: editor.getLine(editor.lastLine()).length};
                editor.replaceRange(getPostResult.body, {line: 0, ch: 0}, endRange);
                new Notice('Overwrote current post.');
            }
        });
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new MataroaSettingsTab(this.app, this));
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

class MataroaSettingsTab extends PluginSettingTab {
    plugin: MataroaPlugin;

    constructor(app: App, plugin: MataroaPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Mataroa API key')
            .setDesc('Get this from https://mataroa.blog/api/docs/.')
            .addText(text => text
                .setValue(this.plugin.settings.apiKey)
                .onChange(async (value) => {
                    this.plugin.settings.apiKey = value;
                    await this.plugin.saveSettings();
                }));
    }
}
