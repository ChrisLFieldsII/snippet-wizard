import { useCallback, useMemo } from 'react'

import {
  Link as ChakraLink,
  Tag,
  TagLeftIcon,
  TagLabel,
  Wrap as ChakraWrap,
  TagProps,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'

import { SERVICES_MAP } from '~/app-constants'
import { ServiceTag, UISnippet } from '~/types'
import { getKeys, RenderNull } from '~/utils'

type ServiceBadgesProps = {
  services: ServiceTag[]
  /**
   * the wrapper component for each rendered service badge. allows dynamic wrapper functionality
   * like using a wrapper that makes an anchor, or enables badge selection, etc
   */
  Wrapper?: (props: {
    children: React.ReactNode
    service: ServiceTag
  }) => JSX.Element
  /** get props for each rendered badge */
  getBadgeProps?: (svc: ServiceTag) => TagProps
  renderEmpty?: () => JSX.Element
}

const DefaultWrapper: ServiceBadgesProps['Wrapper'] = ({ children }) => {
  return <>{children}</>
}

/**
 * Render service badges with no action
 */
export const ServiceBadges = ({
  services,
  Wrapper = DefaultWrapper,
  // @ts-ignore
  getBadgeProps = () => {},
  renderEmpty = RenderNull,
}: ServiceBadgesProps) => {
  if (!services.length) {
    return renderEmpty()
  }

  return (
    <ChakraWrap>
      {services.map((svc) => {
        return (
          <Wrapper key={svc} service={svc}>
            <Tag borderRadius={'full'} {...getBadgeProps(svc)}>
              <TagLeftIcon boxSize="12px" as={SERVICES_MAP[svc].Icon} />
              <TagLabel>{svc}</TagLabel>
            </Tag>
          </Wrapper>
        )
      })}
    </ChakraWrap>
  )
}

/**
 * Render service badges with links to snippet for each service
 */
export const ServiceBadgesWithLinks = ({
  servicesMap,
}: {
  servicesMap: UISnippet['servicesMap']
}) => {
  const Wrapper: ServiceBadgesProps['Wrapper'] = useMemo(() => {
    return ({ children, service }) => {
      const mapping = servicesMap[service]

      return (
        <ChakraLink href={mapping.url} isExternal>
          {children}
        </ChakraLink>
      )
    }
  }, [])

  return <ServiceBadges services={getKeys(servicesMap)} Wrapper={Wrapper} />
}

type ServiceSelectorProps = {
  allServices: ServiceTag[]
  alreadyServices: ServiceTag[]
  selectedServices: ServiceTag[]
  onSelect(newServices: ServiceTag[]): void
}

/**
 * Render service badges with ability to (de)select services
 */
export const ServiceSelector = ({
  allServices,
  alreadyServices,
  selectedServices,
  onSelect,
}: ServiceSelectorProps) => {
  const Wrapper: ServiceBadgesProps['Wrapper'] = useMemo(() => {
    return ({ children, service }) => {
      const hasSelectedService = selectedServices.includes(service)

      return (
        <button
          onClick={() => {
            const newServices = hasSelectedService
              ? selectedServices.filter((svc) => svc !== service)
              : selectedServices.concat(service)

            onSelect(newServices)
          }}
          title={
            hasSelectedService
              ? `Remove ${service} from selections`
              : `Add ${service} to selections`
          }
        >
          {children}
        </button>
      )
    }
  }, [selectedServices, onSelect])

  const getBadgeProps: ServiceBadgesProps['getBadgeProps'] = (service) => {
    if (selectedServices.includes(service)) {
      return {
        variant: 'subtle',
        colorScheme: 'green',
      }
    }

    return {
      variant: 'outline',
    }
  }

  // filter out services user is already enrolled in
  const services = allServices.filter((svc) => !alreadyServices.includes(svc))

  const renderEmpty = useCallback(() => {
    return (
      <Alert status="success">
        <AlertIcon />
        This snippet is in all of the registered services! 🥳
      </Alert>
    )
  }, [])

  return (
    <ServiceBadges
      services={services}
      Wrapper={Wrapper}
      getBadgeProps={getBadgeProps}
      renderEmpty={renderEmpty}
    />
  )
}
