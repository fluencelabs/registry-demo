import { AvmRunnerBackground } from '@fluencelabs/avm-runner-background';

export default new AvmRunnerBackground({
    method: 'fetch-from-url',
    baseUrl: 'https://fluence.one/registry-demo/',
    filePaths: {
        avm: 'avm.wasm',
        marine: 'marine-js.wasm',
    },
});
