module.exports = {
  parser:  "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: [
    "simple-import-sort",
    "import"
  ],
  rules: {
    "import/newline-after-import": ["error", { "count": 1 }],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": ["error", { groups: [
        ["^react", "^@?\\w"],

        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],

        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],

        ["^.+\\.s?css$"],
      ] }]
  },
}
