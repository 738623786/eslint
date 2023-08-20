/**
 * @fileoverview Tests for gde20-loop-prefer-let rule.
 * @author Toru Nagashima
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/gde20-loop-prefer-let"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.defineRule("use-x", {
    create(context) {
        const sourceCode = context.sourceCode;

        return {
            VariableDeclaration(node) {
                sourceCode.markVariableAsUsed("x", node);
            }
        };
    }
});


ruleTester.run("gde20-loop-prefer-let", rule, {
    valid: [
        "for (let a in {}) {let b = ''}",
        "for (let item of []) {if(item.name) {let b = ''}}",
        "for (let i;  i < 10; i ++) {let b = ''}",
        "while (true) {let b = ''; parent = parent.parent}",
        "do {let dd = 33} while (true)"
    ],

    invalid: [
        {
            code: "for (let a in {}) {const b = ''}",
            output: "for (let a in {}) {let b = ''}",
            errors: [{ messageId: "useLet", data: { name: "b" }, type: "Identifier" }]
        },
        {
            code: "for (const a in {}) {let b = ''}",
            output: "for (let a in {}) {let b = ''}",
            errors: [{ messageId: "useLet", data: { name: "a" }, type: "Identifier" }]
        },
        {
            code: "for (const item of []) {if(item.name) {let b = ''}}",
            output: "for (let item of []) {if(item.name) {let b = ''}}",
            errors: [{ messageId: "useLet", data: { name: "item" }, type: "Identifier" }]
        },
        {
            code: "for (let item of []) {if(item.name) {const b = ''}}",
            output: "for (let item of []) {if(item.name) {let b = ''}}",
            errors: [{ messageId: "useLet", data: { name: "b" }, type: "Identifier" }]
        }
    ]
});
