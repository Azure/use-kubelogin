# azure/use-kubelogin

This action helps you to setup [kubelogin][] in your GitHub Actions workflow.

## Action Inputs

| Name | Description | Default | Example |
|:--:|--|--|--|
| `kubelogin-version` (optional) | The version of kubelogin to use. Please see the following section [kubelogin version](#kubelogin-version) for details. | `latest` | `v0.0.24` |
| `skip-cache` (optional) | Skip discovering the kubelogin from cache. By setting this to true will force to download the kubelogin from GitHub release. | `false` | `true` | 

## Usage Examples

### Basic

```yaml
- uses: azure/use-kubelogin@v1
  with:
    kubelogin-version: 'v0.0.24'
```

### Use Latest Version

> **NOTE**
> We recommend to use a specific version of kubelogin to have consistent behavior.

```yaml
- uses: azure/use-kubelogin@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    kubelogin-version: 'latest'
```

### Skip Cache

> **NOTE**
> This option is designed for testing purpose.

```yaml
- uses: azure/use-kubelogin@v1
  with:
    kubelogin-version: 'v0.0.24'
    skip-cache: 'true'
```

## kubelogin version

If the `kubelogin-version` is not set, or is one of `latest` or `*`, the action will try to use the latest version of kubelogin.
However, due to the GitHub API rate limiting settings, this action requires to pass in the `GITHUB_TOKEN` to the environment variable. If this environment variable is not set, we will see error similar to the following:

```
Run Azure/use-kubelogin@{version}
/home/runner/work/_actions/Azure/use-kubelogin/{version}/lib/index.js:14812
            throw new Error('GITHUB_TOKEN is not set, unable to resolve the latest version of kubelogin');
```

> **NOTE**
> To ensure consistent behavior, it is recommended to specify the version of kubelogin to use. We can find the full list of available versions at [kubelogin releases][].

[kubelogin]: https://github.com/Azure/kubelogin
[kubelogin releases]: https://github.com/Azure/kubelogin/releases

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

### Developing

The action source is located at [/src](/src). The action is written in TypeScript and compiled to a single javascript file with [`ncc`][ncc]. It's expected to checkin `lib/index.js` to the repository.

To setup the development environment, run the following commands:

```bash
$ npm install
```

To build the action script, run the following command:

```bash
$ npm build
```

To test the action, we can use the workflow [Test workflow](https://github.com/Azure/use-kubelogin/actions/workflows/test-kubelogin.yaml) to trigger a build.

[ncc]: https://github.com/vercel/ncc

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

## LICENSE

MIT