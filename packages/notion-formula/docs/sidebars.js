module.exports = {
  API: {
    modules: ["API/modules"],
    interfaces: ["API/interfaces/ifunctionformulainfo"],
  },
  docs: [
    {
      type: "category",
      label: "Introduction",
      items: ["Introduction/Introduction", "Introduction/Getting Started", "Introduction/Features",  "Introduction/Typescript Support"]
    },
    {
      type: "category",
      label: "Theory",
      items: ["Theory/Notion Formula", "Theory/Schema Map"]
    },
    {
      type: "category",
      label: "Reference",
      items: ["Reference/Notion Functions"]
    },
    {
      type: "category",
      label: "Usage",
      items: ["Usage/Object Representation", "Usage/Array Representation", "Usage/String Representation", ]
    },
    {
      type: "category",
      label: "Parsing",
      items: ["Parsing/Errors"]
    }
  ]
}