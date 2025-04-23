This repository has been created with [setup-sda](https://github.com/nshiab/setup-sda/).

It's using [simple-data-analysis](https://github.com/nshiab/simple-data-analysis) and [journalism](https://github.com/nshiab/journalism).

Here's the recommended workflow:

- Put your raw data in the `sda/data` folder. Note that this folder is gitignored.
- Use the `sda/main.ts` file to clean and process your raw data. Write the results to the `sda/output` folder.

When working on your project, use the following command:

- `deno task sda` will watch your `sda/main.ts` and its dependencies. Everytime you'll save some changes, the data will be reprocessed.
