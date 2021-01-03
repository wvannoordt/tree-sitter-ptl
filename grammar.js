module.exports = grammar({
    name: "ptl",
    // Useful links:
    // https://github.com/psmitt/metalanguage/blob/master/examples/ScopeList.ScopeList
    // https://github.com/tree-sitter/tree-sitter/blob/master/cli/src/generate/rules.rs
    // http://tree-sitter.github.io/tree-sitter/implementation#grammar-rules
    // https://github.com/atom/language-html/blob/master/grammars/tree-sitter-html.cson
    // https://gist.github.com/Aerijo/df27228d70c633e088b0591b8857eeef
    // https://github.com/tree-sitter/tree-sitter-cpp/blob/master/grammar.js
    // https://stackoverflow.com/questions/64479973/compiled-against-different-node-module-version-tree-sitter-parser-atom-packag
    rules:
    {
        source_file: $ => repeat($._definition),
        _definition: $ => choice
        (
            $.comment,
            $.preprocessor_definition,
            $.section_identifier,
            $.assignment
        ),
        assignment: $ => seq($.string_identifier, $.assign_sym, $.rvalue_statement),
        section_identifier: $ => seq($.string_identifier, '{', repeat($._definition) ,'}'),
        rvalue_statement: $ => choice
        (
            $.basic_identifier,
            $.function_invocation,
            $.variable_invocation,
            $.vector
        ),
        basic_identifier: $ => choice
        (
            $.boolean_identifier,
            $.number_identifier,
            $.string_identifier,
        ),
        vector: $ => seq('[', commaSep($.rvalue_statement) , ']'),
        variable_invocation: $ => seq($.variable_invoke_sym, '(', $.rvalue_statement, ')'),
        parameter_list: $ => commaSep1($.rvalue_statement),
        function_invocation: $ => seq($.function_invocation_sym, $.string_identifier, '(', $.parameter_list, ')'),
        preprocessor_keyword_define: $ => '#define',
        preprocessor_keyword_if: $ => '#if',
        preprocessor_definition: $ => seq($.preprocessor_keyword, ' ', $.preprocessor_name, ' ', $.rvalue_statement),
        preprocessor_keyword: $ => choice
        (
            $.preprocessor_keyword_define,
            $.preprocessor_keyword_if
        ),
        preprocessor_name: $ => choice($.string_identifier),
        comment: $ => seq($.comment_symbol, $.anything),
        comment_symbol: $ => '//',
        boolean_identifier: $ => choice
        (
            't', 'f', 'true', 'false'
        ),
        number_identifier: $ => /[-.e\d]+/,
        string_identifier: $ => /[a-zA-Z_\d]+/,
        function_invocation_sym: $ => '@',
        anything: $ => /.*/,
        assign_sym: $ => '=',
        variable_invoke_sym: $ => '$'
    }
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
