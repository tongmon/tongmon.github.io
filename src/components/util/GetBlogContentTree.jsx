let blogContentTree = {
  label: "All",
  childContentCnt: 0,
  isLeaf: false,
  children: [],
};

export function GetBlogContentTree() {
  if (blogContentTree.children.length > 0) return blogContentTree;

  let paths = Object.keys(
    import.meta.glob("/src/assets/blog_content/**/*", { eager: true })
  );

  for (const fullPath of paths) {
    const parts = fullPath.replace("/src/assets/blog_content/", "").split("/");
    let parent = blogContentTree;
    for (let i = 0; i < parts.length && parent != undefined; i++) {
      const fileRegex = /^[^\\/:\*\?"<>\|]+?\.[a-zA-Z0-9]+$/;
      if (fileRegex.test(parts[i])) {
        parent.isLeaf = true;
        parent.children.length = 0;
        parent = undefined;
        continue;
      }
      let targetChild = parent.children.find(
        (child) => child.label === parts[i]
      );
      if (targetChild == undefined) {
        let child = {
          label: parts[i],
          childContentCnt: 0,
          isLeaf: false,
          children: [],
        };
        parent.children.push(child);
        parent = child;
      } else {
        parent = targetChild;
        if (parent.isLeaf === true) {
          parent = undefined;
        }
      }
    }
  }

  function CountChildContent(node) {
    for (const child of node.children) {
      CountChildContent(child);
      node.childContentCnt += child.childContentCnt;
    }
    if (node.isLeaf) {
      node.childContentCnt = 1;
    }
  }

  CountChildContent(blogContentTree);

  return blogContentTree;

  // for (const fullPath of paths) {
  //   const parts = fullPath.replace("/src/assets/Learn/", "").split("/");
  //   let current = root;

  //   for (const [index, part] of parts.entries()) {
  //     if (!current[part]) {
  //       current[part] = index === parts.length - 1 ? null : {};
  //     }
  //     current = current[part];
  //   }
  // }

  // let dropdownItems = toDropdownFormat(root);

  // return dropdownItems.map((item, index) => (
  //   <Dropdown key={index} item={item} />
  // ));
}
