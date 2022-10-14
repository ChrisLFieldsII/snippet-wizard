import { useMemo } from 'react'

import {
  Link as ChakraLink,
  Tag,
  TagLeftIcon,
  TagLabel,
  Wrap as ChakraWrap,
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
}

const DefaultWrapper: ServiceBadgesProps['Wrapper'] = ({ children }) => {
  return <>{children}</>
}

export const ServiceBadges = ({
  services,
  Wrapper = DefaultWrapper,
}: ServiceBadgesProps) => {
  return (
    <ChakraWrap>
      {services.map((svc) => {
        return (
          <Wrapper key={svc} service={svc}>
            <Tag>
              <TagLeftIcon boxSize="12px" as={SERVICES_MAP[svc].Icon} />
              <TagLabel>{svc}</TagLabel>
            </Tag>
          </Wrapper>
        )
      })}
    </ChakraWrap>
  )
}

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
  onSelect(service: ServiceTag): void
}

export const ServiceSelector = ({
  allServices,
  alreadyServices,
  selectedServices,
  onSelect,
}: ServiceSelectorProps) => {
  return (
    <>
      <p>service selector</p>
    </>
  )
}
