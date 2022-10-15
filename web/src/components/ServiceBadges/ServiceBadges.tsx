import { useMemo } from 'react'

import {
  Link as ChakraLink,
  Tag,
  TagLeftIcon,
  TagLabel,
  Wrap as ChakraWrap,
  Button,
  TagProps,
  Box,
  Flex,
} from '@chakra-ui/react'

import { SERVICES_MAP } from '~/app-constants'
import { ServiceTag, UISnippet } from '~/types'
import { getKeys } from '~/utils'

type ServiceBadgesProps = {
  services: ServiceTag[]
  Wrapper?: (props: {
    children: React.ReactNode
    service: ServiceTag
  }) => JSX.Element
  getBadgeProps?: (svc: ServiceTag) => TagProps
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
}: ServiceBadgesProps) => {
  return (
    <ChakraWrap>
      {services.map((svc) => {
        return (
          <Wrapper key={svc} service={svc}>
            <Tag {...getBadgeProps(svc)}>
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
      console.log({ allServices, alreadyServices, selectedServices })
      const alreadyHasService = alreadyServices.includes(service)
      const hasSelectedService = selectedServices.includes(service)

      if (alreadyHasService) {
        return (
          <Flex align={'center'} title={`${service} already has this snippet`}>
            {children}
          </Flex>
        )
      }

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
  }, [selectedServices, alreadyServices, onSelect, allServices])

  const getBadgeProps: ServiceBadgesProps['getBadgeProps'] = (service) => {
    const alreadyHasService = alreadyServices.includes(service)

    if (alreadyHasService) {
      return {
        variant: 'subtle',
        colorScheme: 'green',
        cursor: 'not-allowed',
      }
    }

    if (selectedServices.includes(service)) {
      return {
        variant: 'subtle',
      }
    }

    return {
      variant: 'outline',
    }
  }

  return (
    <ServiceBadges
      services={allServices}
      Wrapper={Wrapper}
      getBadgeProps={getBadgeProps}
    />
  )
}
