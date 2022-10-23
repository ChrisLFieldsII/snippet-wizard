import * as React from 'react'

import {
  chakra,
  Box,
  IconButton,
  IconButtonProps,
  HStack,
  Text,
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
  ButtonProps,
  As,
  Icon,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  useBreakpointValue,
  InputProps,
  Wrap,
  Tooltip,
  Code,
  useColorMode,
  WrapItem,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { BsArrowsCollapse, BsArrowsExpand } from 'react-icons/bs'
import { FaSun, FaMoon } from 'react-icons/fa'

import { Link, routes } from '@redwoodjs/router'

import { SERVICES_CONFIG, SERVICE_TAGS } from 'src/app-constants'
import { useStore } from 'src/state'
import { ServiceTag } from 'src/types'
import { emitter } from 'src/utils'

import { Logo } from '~/components'

type MainLayoutProps = {
  children?: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const openDrawer = useStore((store) => store.openDrawer)

  const onToggleCode = (isOpen: boolean) => {
    emitter.emit('toggleCode', { isOpen })
  }

  // add keyboard listener to toggle code
  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const { key } = e
      const keys = ['[', ']']
      const target = e.target as HTMLElement

      if (!keys.includes(key)) return
      if (/^(?:input|textarea|select|button)$/i.test(target.tagName)) return

      e.preventDefault()

      if (key === '[') onToggleCode(true)
      else if (key === ']') onToggleCode(false)
    }

    document.addEventListener('keyup', fn)

    return () => {
      document.removeEventListener('keyup', fn)
    }
  }, [])

  return (
    <Flex
      as="section"
      direction={{ base: 'column', lg: 'row' }}
      height="100vh"
      bg="bg-canvas"
      // overflowY="auto"
    >
      {isDesktop ? <Sidebar /> : <Navbar />}

      {/* FIXME: vh needs to account for `isDesktop` */}
      <Flex direction={'column'} w="full">
        {/* header */}
        <Flex
          justify={'space-between'}
          p={3}
          h="8vh"
          bg="bg-surface"
          boxShadow={useColorModeValue('sm', 'sm-dark')}
        >
          <Wrap>
            <WrapItem>
              <Tooltip
                aria-label="Open all code blocks"
                label={
                  <HStack>
                    <Text>{'Open all code blocks'}</Text>
                    <Code fontWeight={'extrabold'} colorScheme={'blue'}>
                      {'['}
                    </Code>
                  </HStack>
                }
              >
                <IconButton
                  aria-label="Open all code blocks"
                  icon={<BsArrowsExpand />}
                  onClick={() => onToggleCode(true)}
                />
              </Tooltip>
            </WrapItem>

            <WrapItem>
              <Tooltip
                aria-label="Close all code blocks"
                label={
                  <HStack>
                    <Text>{'Close all code blocks'}</Text>
                    <Code fontWeight={'extrabold'} colorScheme={'blue'}>
                      {']'}
                    </Code>
                  </HStack>
                }
              >
                <IconButton
                  aria-label="Close all code blocks"
                  icon={<BsArrowsCollapse />}
                  onClick={() => onToggleCode(false)}
                />
              </Tooltip>
            </WrapItem>
          </Wrap>

          <Wrap>
            <WrapItem>
              <DarkModeToggle />
            </WrapItem>
            <WrapItem>
              <Button
                variant="primary"
                onClick={() => emitter.emit('clickedCreate')}
              >
                Create
              </Button>
            </WrapItem>
          </Wrap>
        </Flex>

        {/* main content */}
        <main style={{ height: '92vh', overflow: 'auto' }}>{children}</main>
      </Flex>
    </Flex>
  )
}

export default MainLayout

const Bar = chakra('span', {
  baseStyle: {
    display: 'block',
    pos: 'absolute',
    w: '1.25rem',
    h: '0.125rem',
    rounded: 'full',
    bg: 'currentcolor',
    mx: 'auto',
    insetStart: '0.125rem',
    transition: 'all 0.12s',
  },
})

const ToggleIcon = (props: { active: boolean }) => {
  const { active } = props
  return (
    <Box
      className="group"
      data-active={active ? '' : undefined}
      as="span"
      display="block"
      w="1.5rem"
      h="1.5rem"
      pos="relative"
      aria-hidden
      pointerEvents="none"
    >
      <Bar
        top="0.4375rem"
        _groupActive={{ top: '0.6875rem', transform: 'rotate(45deg)' }}
      />
      <Bar
        bottom="0.4375rem"
        _groupActive={{ bottom: '0.6875rem', transform: 'rotate(-45deg)' }}
      />
    </Box>
  )
}

interface ToggleButtonProps extends IconButtonProps {
  isOpen: boolean
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { isOpen, ...iconButtonProps } = props
  return (
    <IconButton
      position="relative"
      variant="unstyled"
      size="sm"
      color={isOpen ? 'white' : 'muted'}
      zIndex="skipLink"
      icon={<ToggleIcon active={isOpen} />}
      {...iconButtonProps}
    />
  )
}

export const Sidebar = () => {
  const services = useStore((store) => store.services)

  return (
    <Flex as="section" h="100vh" bg="bg-canvas" pos="sticky" top={0}>
      <Flex
        flex="1"
        bg="bg-surface"
        overflowY="auto"
        boxShadow={useColorModeValue('md', 'sm-dark')}
        maxW={{ base: 'full', sm: 'xs' }}
        py={{ base: '6', sm: '8' }}
        px={{ base: '4', sm: '6' }}
      >
        <Stack justify="space-between" spacing="1">
          <Stack spacing={{ base: '5', sm: '6' }} shouldWrapChildren>
            <Logo showTitle />

            {SERVICE_TAGS.map((tag) => {
              return (
                <ServiceInput
                  key={tag}
                  tag={tag}
                  icon={SERVICES_CONFIG[tag].Icon}
                />
              )
            })}
          </Stack>
          <Stack spacing={{ base: '5', sm: '6' }}>
            <Divider />

            <Button
              onClick={async () => {
                console.log('services', services)
                emitter.emit('getSnippets')
              }}
            >
              Get Snippets
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <IconButton
      icon={isDark ? <FaSun /> : <FaMoon />}
      aria-label="toggle dark mode"
      onClick={toggleColorMode}
      variant="ghost"
    />
  )
}

interface NavButtonProps extends ButtonProps {
  icon: As
  label: string
}

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, ...buttonProps } = props
  return (
    <Button variant="ghost" justifyContent="start" {...buttonProps}>
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="subtle" />
        <Text>{label}</Text>
      </HStack>
    </Button>
  )
}

export const Navbar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  return (
    <Box
      width="full"
      py="4"
      px={{ base: '4', md: '8' }}
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Flex justify="space-between">
        <Logo />
        <ToggleButton
          isOpen={isOpen}
          aria-label="Open Menu"
          onClick={onToggle}
        />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          isFullHeight
          preserveScrollBarGap
          // Only disabled for showcase
          trapFocus={false}
        >
          <DrawerOverlay />
          <DrawerContent>
            <Sidebar />
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  )
}

type ServiceInputProps = InputProps & {
  icon: IconType
  tag: ServiceTag
}

/**
 * Input for a services api token
 */
const ServiceInput = ({ icon, tag, ...props }: ServiceInputProps) => {
  const setToken = useStore((store) => store.setToken)
  const services = useStore((store) => store.services)

  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={icon} color="muted" boxSize="5" />
        </InputLeftElement>
        <Input
          {...props}
          placeholder={tag}
          type="password"
          value={services[tag].token}
          onChange={(e) => {
            setToken(tag, e.currentTarget.value)
          }}
        />
      </InputGroup>
    </>
  )
}
