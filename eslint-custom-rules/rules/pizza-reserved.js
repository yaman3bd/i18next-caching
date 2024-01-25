module.exports = {
  create(context) {
    const scopes = [];

    function isInsideUseScopedTranslation() {
      return scopes.includes("useScopedTranslation");
    }

    return {
      Identifier(node) {
        if (node.name.toLowerCase() === "pizza") {
          return context.report({
            node,
            message: 'Nope, the variable name "pizza" is reserved'
          });
        }
        return null;
      },
      ImportDeclaration(node) {
        const { specifiers, source } = node;

        if (source.value === "next-i18next") {
          if (specifiers.some((specifier) => specifier.imported.name === "useTranslation")) {
            if (!isInsideUseScopedTranslation()) {
              context.report({
                node: node,
                message: "Don't use 'useTranslation' directly outside of 'useScopedTranslation'."
              });
            }
          }
        }
      },
      "FunctionDeclaration, FunctionExpression, ArrowFunctionExpression"(node) {
        if (node.id && node.id.name) {
          scopes.push(node.id.name);
        }
      },
      "FunctionDeclaration:exit, FunctionExpression:exit, ArrowFunctionExpression:exit"(node) {
        if (node.id && node.id.name) {
          scopes.pop();
        }
      }
    };
  }
};
