let instance;

export class PostDataManager {
  constructor() {
    if (instance) {
      return instance;
    }

    this.categorizedPosts = new Map([["All", []]]);
    this.postTree = {
      label: "All",
      childPostCnt: 0,
      parent: null,
      isVisible: true, // if false, the node is hidden in the Dropdown UI
      isOpen: true,
      children: [],
      module: null,
    };

    let blogModules = import.meta.glob("/src/assets/Blog/**/*");
    let paths = Object.keys(blogModules);

    for (const fullPath of paths) {
      const fileRegex = /^[^\\/:\*\?"<>\|]+?\.[a-zA-Z0-9]+$/;
      const parts = fullPath.replace("/src/assets/Blog/", "").split("/");
      let parent = this.postTree;

      for (let i = 0; i < parts.length; i++) {
        let targetModule = null;

        if (fileRegex.test(parts[i])) {
          parent.isVisible = false;
          targetModule = blogModules[fullPath];

          if (parts[i].includes("post_info")) {
            const isoStr = parts[i]
              .replace("post_info_", "")
              .replace(".json", "")
              .replace(
                /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
                "$1-$2-$3T$4:$5:$6"
              );
            parent["date"] = new Date(isoStr);

            this.categorizedPosts.get("All").push(parent);
            let pathKey = "";
            for (let j = 0; j < i; j++) {
              pathKey += parts[j] + "/";
              if (!this.categorizedPosts.has(pathKey)) {
                this.categorizedPosts.set(pathKey, []);
              }
              this.categorizedPosts.get(pathKey).push(parent);
              if (j === i - 1) {
                // marking in here
              }
            }
          }
        }

        let targetChild = parent.children.find(
          (child) => child.label === parts[i]
        );

        if (targetChild == undefined) {
          let child = {
            label: parts[i],
            childPostCnt: 0,
            parent: parent,
            isVisible: parent.isVisible,
            isOpen: true,
            children: [],
            module: targetModule,
          };
          parent.children.push(child);
          parent = child;
        } else {
          parent = targetChild;
        }
      }
    }

    function CountChildPost(node) {
      if (node.hasOwnProperty("date")) {
        node.childPostCnt = 1;
        return;
      }
      for (const child of node.children) {
        CountChildPost(child);
        node.childPostCnt += child.childPostCnt;
      }
    }
    CountChildPost(this.postTree);

    this.categorizedPosts.forEach((posts, key) => {
      posts.sort((a, b) => {
        // return new Date(b.date) - new Date(a.date);
        // return a.date < b.date ? -1 : 1;
        return b.date - a.date;
      });
    });

    instance = this;
  }

  getPostTree() {
    return this.postTree;
  }

  getCategorizedPosts() {
    return this.categorizedPosts;
  }
}
