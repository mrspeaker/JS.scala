import esprima from "esprima";

const ast = esprima.parse(`

  const a = 42
  let b = "Hello, World"
  const sq = x => x * x
  const dsq = x => {
    const dx = sq(x)
    return dx * dx
  };
  const d = dsq(a)

  const exclaimer = {
    apply: name => name + "!"
  }

  exclaimer.apply("Hello, World")

`);

//console.log(JSON.stringify(ast, null, 2));

let out = [];
const parse = (ast) => {
  out = [];
  rec_node(ast);
  console.log("Enjoy your .scala!");
  console.log(out.join(""));
}
parse(ast);

function indenty (indent) {
  for (let i = 0; i < indent; i++) { out.push("  ")};
}

function rec_node (node, indent = 0) {

  if (Array.isArray(node)) {
    node.forEach(n => {
      indenty(indent);
      rec_node(n, indent)
    });
    return;
  }

  switch (node.type) {

  case "Program":
    rec_node(node.body, indent);
    break;

  case "VariableDeclaration":

    switch (node.kind) {
    case "var":
    case "let":
      out.push("var ");
      break;
    case "const":
      out.push("val ");
      break;
    }
    rec_node(node.declarations, indent);
    out.push("\n");
    break;

  case "VariableDeclarator":
    rec_node(node.id);
    out.push(" = ");
    rec_node(node.init, indent);
    break;

  case "Identifier":
    out.push(node.name);
    break;

  case "Literal":
    out.push(node.raw);
    break;

  case "BlockStatement":
    out.push("{\n");
    rec_node(node.body, ++indent);
    out.push("\n}");
    break;

  case "ExpressionStatement":
    rec_node(node.expression, indent);
    break;

  case "ArrowFunctionExpression": {
    const [dec, name, op] = out.slice(-3);
    out = out.slice(0, -3);

    out.push(`def ${name} `)
    out.push("(")

    out.push(
      node.params.map(p => p.name + ":HandHolder").join(",")
    )
    out.push(")")
    out.push(" = ")
    rec_node(node.body, indent)
    }
    break;

  case "AssignmentExpression":
  case "BinaryExpression": {
      const {left, operator, right} = node;
      rec_node(left, indent);
      out.push(` ${operator} `);
      rec_node(right, indent);
    }
    break;

  case "ReturnStatement":
    rec_node(node.argument, indent);
    break;

  case "CallExpression":
    rec_node(node.callee);
    out.push("(");
    rec_node(node.arguments)
    out.push(")");
    break;

  case "ObjectExpression":
    const [dec, name, op] = out.slice(-3);
    out = out.slice(0, -3);

    indent++;
    out.push(`object ${name} {\n`)
    rec_node(node.properties, indent);
    out.push("}")
    break;

  case "MemberExpression":
    out.push("\n")
    if (node.property.name === "apply") {
      rec_node(node.object, indent);
    } else {
      rec_node(node.object, indent);
      out.push(".");
      rec_node(node.property, indent);
    }
    break;

  case "Property":
    indenty(indent)
    out.push("var ")
    rec_node(node.key, indent);
    out.push(" = ");
    rec_node(node.value, indenty);
    out.push("\n")
    break;

  default:
    console.log(node.type)
  }
}
