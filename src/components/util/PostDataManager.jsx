let instance;

export class PostDataManager {
  constructor() {
    if (instance) {
      return instance;
    }

    let rootPrefix = "Learn";
    this.categorizedPosts = new Map([[`/${rootPrefix}/All`, []]]);
    this.postTree = {
      rootPrefix: rootPrefix,
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
      const mdRegex = /\.md$/i;
      const parts = fullPath.replace("/src/assets/Blog/", "").split("/");
      let parent = this.postTree;

      for (let i = 0; i < parts.length; i++) {
        let targetModule = null;

        if (fileRegex.test(parts[i])) {
          parent.isVisible = false;
          // if (mdRegex.test(parts[i])) {
          //   fullPath += "?raw";
          // }
          targetModule = blogModules[fullPath + "?raw"];
          console.log(targetModule);
          if (parts[i].includes("post_info")) {
            const isoStr = parts[i]
              .replace("post_info_", "")
              .replace(".json", "")
              .replace(
                /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/,
                "$1-$2-$3T$4:$5:$6"
              );
            parent["date"] = new Date(isoStr);

            this.categorizedPosts.get(`/${rootPrefix}/All`).push(parent);
            let pathKey = `/${rootPrefix}/` + parts[0];
            for (let j = 0; j < i; j++) {
              if (!this.categorizedPosts.has(pathKey)) {
                this.categorizedPosts.set(pathKey, []);
              }
              if (j === i - 1) {
                this.categorizedPosts.get(pathKey).push(true);
              }
              this.categorizedPosts.get(pathKey).push(parent);
              pathKey += "/" + parts[j + 1];
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

    function countChildPost(node) {
      if (node.hasOwnProperty("date")) {
        node.childPostCnt = 1;
        return;
      }
      for (const child of node.children) {
        countChildPost(child);
        node.childPostCnt += child.childPostCnt;
      }
    }
    countChildPost(this.postTree);

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
