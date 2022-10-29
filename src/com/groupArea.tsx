import { Box, Button, ChakraProps, Checkbox, Collapse, Flex, Input, InputGroup, InputLeftElement, SimpleGrid } from "@chakra-ui/react";
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useDrop } from 'react-dnd'
import { MdOutlineDragIndicator, MdUnfoldLess, MdUnfoldMore, MdClose,MdSearch } from "react-icons/md";
import { getValues } from "../api/request";
import { useToast } from '@chakra-ui/react'

const GroupItem: FC<{
  item: any
  onUpdate: (p: any) => void
  onClose: () => void
}> = ({ item, onUpdate, onClose }) => {
  const [isOpen, setOpen] = useState(true)
  const [searchText,setSearchText] = useState('')
  const iconStyle: ChakraProps = {
    w: '1.5em',
    cursor: 'pointer',
    color: 'gray'
  }
  const values: any[] = item.values;
  const fildteredValues = useMemo(()=>{
    return values.filter(el=>{
      let v:string = String(el.value);
      return v.toLowerCase?.().includes(searchText.toLowerCase())
    })
  },[values,searchText]);

  const checked: any[] = item.checked;
  useEffect(() => { initData(item.type) }, []);
  
  async function initData(type: any) {
    const res = await getValues(type)     
    onUpdate({
      ...item,
      values: res,
      checked: [],
    })
  }
  function clearAll() {
    onUpdate({
      ...item,
      checked: [],
    })
  }
  function toggleItem(val: string) {
    let newList: string[] = [];
    if (checked.includes(val)) {
      newList = checked.filter(el => el != val)
    } else {
      newList = [...checked, val]
    }
    onUpdate({
      ...item,
      checked: newList,
    })
  }


  return <Box boxShadow="sm" borderColor="gray.100" borderWidth={1} borderRadius="sm" mb={2}>
    <Flex boxShadow="sm" p={2} alignItems="center">
      <Box {...iconStyle}><MdOutlineDragIndicator /></Box>
      <Box flexGrow={1}>
        {item.type}
        <Box as="span" fontWeight={700}> ={checked.join(',')} </Box>
      </Box>
      <Box {...iconStyle} onClick={() => setOpen(() => !isOpen)}>
        {isOpen ? <MdUnfoldLess /> : <MdUnfoldMore />}
      </Box>
      <Box {...iconStyle} onClick={onClose}><MdClose /></Box>
    </Flex>
    <Collapse in={isOpen} animateOpacity>
      <Box p={5}>
        <Box fontWeight={700} color="gray.700" mb={2}>{item.path}</Box>
        <InputGroup mb={2} w="20em">
          <InputLeftElement
            pointerEvents='none'
            children={<MdSearch size={16} color='gray.300'/>}
          />
          <Input placeholder='Search text..' 
            onChange={ev=>setSearchText(ev.target.value)} 
            value={searchText}/>
        </InputGroup>

        <Flex alignItems="center" mb={2}>
          <Button mr={2} colorScheme='green' variant='link' onClick={clearAll}>
            Clear All
          </Button>
          <Box fontWeight={700}> {checked.length } Selected</Box>
        </Flex>


        <SimpleGrid columns={4} spacing={2}>
          {
            fildteredValues.map(el => <Flex key={el.value} justify="space-between" pr={6}>
              <Checkbox colorScheme='green'
                isChecked={checked.includes(el.value)}
                onChange={(e) => toggleItem(el.value)}>
                {el.value}
              </Checkbox>
              <Box>{el.count}</Box>
            </Flex>
            )
          }
        </SimpleGrid>
      </Box>
    </Collapse>
  </Box>
}

function GroupArea({ group,groupList, onUpdate }: {
  groupList:any[]
  group: any
  onUpdate: (p: any) => void
}) {
  const toast = useToast()
  const list: any[] = group.items

  const [{ isOver, }, drop] = useDrop(
    () => ({
      accept: '1',
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
      drop: (item: any) => {
        if(list.find(el=>el.type==item.type)){
          toast({
            title: 'Duplicated!',
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position:'top'
          })
          return
        }        
        onUpdate({
          ...group,
          items: [
            ...group.items,
            {
              ...item,
              values: [],
              checked: [],
            }
          ]
        })
      }
    }),
    [groupList]
  );


  function delItem(idx: number) {
    onUpdate({
      ...group,
      items: list.filter((_, index) => index != idx)
    })
  }
  function updateItem(data: any) {    
    onUpdate({
      ...group,
      items: list.map(el => {
        if (data.index == el.index) return data;
        return el;
      })
    })
  }
  return (
    <Box ref={drop} p={2} bg="white" mb={4} boxShadow="ms" borderColor="gray.100" borderWidth={1}>
      <Box borderColor={isOver ? 'green.500' : 'transparent'} borderWidth="2px" borderRadius="sm">
        {
          list.map((item, idx) =>
              <GroupItem item={item}
                onClose={() => delItem(idx)}
                onUpdate={updateItem}
                key={`GroupItem${idx}${group.groupId}`}
              ></GroupItem>
          )
        }
      </Box>

    </Box>
  );
}

export default GroupArea;
