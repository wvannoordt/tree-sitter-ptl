module.exports = grammar({
    name: "ptl",
    // Useful links:
    // https://github.com/psmitt/metalanguage/blob/master/examples/ScopeList.ScopeList
    // https://github.com/tree-sitter/tree-sitter/blob/master/cli/src/generate/rules.rs
    // http://tree-sitter.github.io/tree-sitter/implementation#grammar-rules
    // https://github.com/atom/language-html/blob/master/grammars/tree-sitter-html.cson
    // https://gist.github.com/Aerijo/df27228d70c633e088b0591b8857eeef
    // https://github.com/tree-sitter/tree-sitter-cpp/blob/master/grammar.js
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
            $.number_identifier,
            $.string_identifier,
            $.boolean_identifier
        ),
        vector: $ => seq('[', commaSep($.rvalue_statement) , ']'),
        variable_invocation: $ => seq($.variable_invoke_sym, '(', $.rvalue_statement, ')'),
        parameter_list: $ => commaSep1($.rvalue_statement),
        function_invocation: $ => seq($.function_invocation_sym, $.string_identifier, '(', $.parameter_list, ')'),
        preprocessor_definition: $ => seq('#define ', $.preprocessor_name, ' ', $.rvalue_statement, '\n'),
        preprocessor_name: $ => choice($.string_identifier),
        comment: $ => seq('//', $.string_identifier),
        boolean_identifier: $ => choice
        (
            't', 'f', 'true', 'false'
        ),
        number_identifier: $ => /[0123456789]/,
        string_identifier: $ => /[a-zA-Z]+/,
        function_invocation_sym: $ => '@',
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