# lebel-police

> A GitHub App built with [Probot](https://github.com/probot/probot) that ラベルを良い感じ貼ってくれるGitHubApps

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t lebel-police .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> lebel-police
```

## Contributing

If you have suggestions for how lebel-police could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2021 bake0937 <sadayasu.info@gmail.com>
