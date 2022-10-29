import { Box } from "@chakra-ui/react";
import React, { FC, useState } from 'react';
import { useDrop } from 'react-dnd'
import GroupArea from './groupArea'

const DropArea: FC<{}> = () => {
  const [list, setList] = useState<any[]>([])
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: '1',
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),

      drop: (item: any, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return
        };
        setList([...list, {
          groupId: Math.random(),
          items: [
            {
              ...item,
              values: [],
              checked: []
            }
          ]
        }])
      }
    }),
    [list]
  )
  function areaUpdate(data: any) {
    setList(list.map((el => {
      if (el.groupId == data.groupId) {
        return data
      } else {
        return el
      }
    }))
      .filter(el => el.items.length != 0)
    )
  }
  return <>
    <Box ref={drop} p={0.5} bg="green.50" flex={1}>

      <Box minH={500} maxH={900} overflowY="auto" w="full" p={6} 
        borderColor={isOver ? 'green.500' : 'transparent'} borderWidth="2px" borderRadius="sm">
        {list.map((group, i) => <Box key={i}>
          <GroupArea onUpdate={areaUpdate} group={group} groupList={list}></GroupArea>
        </Box>)}

      </Box>
    </Box>
  </>
}

export default DropArea;
