import { useState } from 'react'
import { Box, Flex } from "@chakra-ui/react"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Tree from './com/tree'
import DropArea from './com/dropArea'
import { usePreview } from 'react-dnd-preview';
import { MdOutlineDragIndicator,  MdGroups} from "react-icons/md";

const MyPreview = () => {
  const {display, item, style} = usePreview() as any;
  if (!display) {
    return null;
  }
  return <div style={style}>
    <Flex alignItems={'center'} bg="white" w="20em" px={8}
      borderWidth={1} borderColor={'gray.300'} borderRadius="sm" boxShadow={"sm"} >
      <Box mr={2}><MdOutlineDragIndicator /></Box>
      <Box mr={2}><MdGroups /></Box>
      <Box color="gray.700">{item.type}</Box>
    </Flex>
  </div>;
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <MyPreview />
      <Flex m={10} borderColor="gray.200" borderWidth={1}>
        <Tree></Tree>
        <DropArea></DropArea>
      </Flex>
    </DndProvider>
  )
}

export default App
