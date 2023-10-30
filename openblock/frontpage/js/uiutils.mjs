export default {
    install(app) {
        app.config.globalProperties.prompt = AsyncPrompt.prompt;
    }
}