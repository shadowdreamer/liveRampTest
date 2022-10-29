import { Box, ChakraProps, ChakraStyledOptions, Collapse, Flex } from "@chakra-ui/react";
import React, { FC, ReactNode, useEffect, useState } from 'react';
import type { NameTree, TreeItem } from '../types'
import { getTree } from '../api/request'
import { useDrag, } from 'react-dnd'
import { MdOutlineDragIndicator,  MdGroups, MdKeyboardArrowDown,MdKeyboardArrowRight,MdFolder} from "react-icons/md";

// leaf node, dragable
const Leaf: FC<{
  children: ReactNode
  index: number
  path:string
}> = ({ children, index,path }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: '1',
    item: { index, type: children ,path: path},
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: !!children
  }), [index, children,])

  return <Box ref={(node) => drag(node)} 
    cursor={'grab'}
    opacity={isDragging ? 0.5 : 1} >
    <Flex alignItems={'center'}>
      <Box mr={2}><MdOutlineDragIndicator /></Box>
      <Box mr={2}><MdGroups /></Box>
      <Box color="gray.700">{children}</Box>
    </Flex>
  </Box>
}

const TreeContent: FC<{ item: TreeItem,dep:number,path:string }> = ({ item,dep,path }) => {
  const [isOpen, setOpen] = useState(true)
  if (typeof item == 'string') {
    return <Box pl={`${dep*24}px`} borderBottom="1px" borderColor={'gray.300'}>
      <Leaf index={Math.random()} path={path+item} >{item}</Leaf>
    </Box>
  } else {
    return <Box color={'gray.600'}>
      <Flex onClick={() => setOpen(() => !isOpen)}
         pl={`${dep*24}px`}
        alignItems={'center'} cursor={"pointer"} borderBottom="1px" borderColor={'gray.300'}>
        <Box mr={2}>
          {isOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
        </Box>
        <Box mr={2}><MdFolder /></Box>

        <Box fontWeight={700}>{item.name}</Box>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box >
          {item.children.map(el => 
            <TreeContent path={`${path}${item.name}/`}  key={Math.random()} dep={dep+1} item={el}></TreeContent>
          )}
        </Box>
      </Collapse>
    </Box>
  }
}

function Tree() {
  const [treeList, setTreeList] = useState<NameTree | null>(null);
  useEffect(() => {
    initData()
  }, [])
  async function initData() {
    const data = await getTree()
    setTreeList(data)
  }

  return (
    <Box w={400} px={5} py={2}>
      {
        treeList?.map(item => <TreeContent path="" dep={0} key={Math.random()} item={item}></TreeContent>)
      }
    </Box>
  );
}

export default Tree;
