let blogContentTree = {
  label: "All",
  childContentCnt: 0,
  parent: null,
  isLeaf: false,
  isVisible: true,
  isOpen: true,
  children: [],
  module: null,
};

export function GetBlogContentTree() {
  if (blogContentTree.children.length > 0) return blogContentTree;

  let blogModules = import.meta.glob("/src/assets/blog_content/**/*");
  let paths = Object.keys(blogModules);

  for (const fullPath of paths) {
    const parts = fullPath.replace("/src/assets/blog_content/", "").split("/");
    let parent = blogContentTree;
    for (let i = 0; i < parts.length && parent != undefined; i++) {
      const fileRegex = /^[^\\/:\*\?"<>\|]+?\.[a-zA-Z0-9]+$/;
      let targetModule = null;
      if (fileRegex.test(parts[i])) {
        parent.isLeaf = true;
        targetModule = blogModules[fullPath];
        // parent.children.length = 0;
        // parent = undefined;
        // continue;
      }
      let targetChild = parent.children.find(
        (child) => child.label === parts[i]
      );
      if (targetChild == undefined) {
        let child = {
          label: parts[i],
          childContentCnt: 0,
          parent: parent,
          isLeaf: false,
          isVisible: parent.isLeaf || !parent.isVisible ? false : true,
          isOpen: true,
          children: [],
          module: targetModule,
        };
        parent.children.push(child);
        parent = child;
      } else {
        parent = targetChild;
        // if (parent.isLeaf === true) {
        //   parent = undefined;
        // }
      }
    }
  }

  function CountChildContent(node) {
    if (node.isLeaf) {
      node.childContentCnt = 1;
      return;
    }
    for (const child of node.children) {
      CountChildContent(child);
      node.childContentCnt += child.childContentCnt;
    }
  }

  CountChildContent(blogContentTree);

  SetLearnContentTree();

  return blogContentTree;
}

function SetLearnContentTree() {
  let learnContentTree = null;
  let blogContentTree = GetBlogContentTree();
  for (
    var i = 0;
    i < blogContentTree.children.length && learnContentTree == null;
    i++
  ) {
    if (blogContentTree.children[i].label === "Learn") {
      learnContentTree = blogContentTree.children[i];
    }
  }

  function SetLearnContentTreeVisibility(node) {
    if (node.isLeaf || (node.parent && !node.parent.isVisible)) {
      node.isVisible = false;
    }
    for (let i = 0; i < node.children.length; i++) {
      SetLearnContentTreeVisibility(node.children[i]);
    }
  }

  SetLearnContentTreeVisibility(learnContentTree);
}
