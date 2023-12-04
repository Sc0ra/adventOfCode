import { readFileSync } from 'fs';
import { sortBy } from 'lodash';
import path from 'path';

type BaseNode = {
  name: string;
  path: string[];
  size: number;
};

type FileNode = BaseNode & {
  type: 'file';
};

type FolderNode = BaseNode & { type: 'folder'; children: Record<string, Node> };

type Node = FileNode | FolderNode;

type Tree = {
  name: '/';
  path: ['/'];
  size: number;
  type: 'folder';
  children: Record<string, Node>;
};

const cdRegex = new RegExp(/\$ cd (.+)/);
const lsRegex = new RegExp(/\$ ls/);
const dirRegex = new RegExp(/dir (.+)/);
const fileRegex = new RegExp(/(\d+) (.+)/);

const DISK_FULL_SIZE = 70000000;
const UPDATE_SIZE = 30000000;

const getNodeAtPath = (tree: Tree, path: string[]): Node => {
  if(path.length === 1 && path[0] === '/') return tree;

  let node = tree as FolderNode;
  const pathWithoutRoot = [...path.slice(1)];

  for (const pathPart of pathWithoutRoot  ) {  
    node = node.children[pathPart];
  }

  return node as unknown as Node;
}

export const exercise2 = () => {
  const file = readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = file.split('\n');

  let initialTree: Tree = {
      name: '/',
      path: ['/'],
      size: 0,
      type: 'folder',
      children: {},
    };

  const finalState = lines.reduce<{currentPath: string[]; tree: Tree; files: FileNode[]; folders: FolderNode[]}>(
    (state, line) => {

      if (cdRegex.test(line)) {
        // @ts-expect-error
        const [, cdPath] = cdRegex.exec(line);

        if(cdPath === '/') {
          return {...state, currentPath: ['/']};
        }

        if(cdPath === '..') {
          return {...state, currentPath: state.currentPath.slice(0, -1)};
        }

        return {...state, currentPath: [...state.currentPath, cdPath]};
      }

      if (lsRegex.test(line)) {
        return state;
      }

      if(dirRegex.test(line)) {
        const [, dirName] = dirRegex.exec(line);

        const currentNode = getNodeAtPath(state.tree, state.currentPath);
        
        if(currentNode.type === 'file') {
          throw new Error();
        }

        const folder = {
          name: dirName,
          path: [...state.currentPath, dirName],
          type: 'folder' as const,
          size: 0,
          children: {}
        };

        currentNode.children[dirName] = folder;

        state.folders.push(folder);

        return state;
      }

      if(fileRegex.test(line)) {
        const [, sizeString, fileName] = fileRegex.exec(line);

        const currentNode = getNodeAtPath(state.tree, state.currentPath);

        if(currentNode.type === 'file') {
          throw new Error();
        }

        const fileNode = {
          name: fileName,
          path: [...state.currentPath, fileName],
          type: 'file' as const,
          size: Number.parseInt(sizeString),
        };

        currentNode.children[fileName] = fileNode;
        
        state.files.push(fileNode);

        return state;
      }

      return state;
    },
    {currentPath: ['/'], tree: initialTree, files: [], folders: []}
  );

  const finalTree = finalState.tree;

  finalState.files.forEach(({size, path}) => {
    finalTree.size += size;

    const pathWithoutRoot = [...path.slice(1, -1)];

    let currentNode = finalTree;
    
    pathWithoutRoot.forEach(pathPart => {
      currentNode = currentNode.children[pathPart];
      currentNode.size += size
    });
  });

  const availableSpace = DISK_FULL_SIZE - finalTree.size;
  const missingSpace = UPDATE_SIZE - availableSpace;

  const folderToDelete = sortBy(finalState.folders.filter(folder => folder.size >= missingSpace), 'size')[0];

  return folderToDelete.size;
};

const response = exercise2();

console.log(response)
