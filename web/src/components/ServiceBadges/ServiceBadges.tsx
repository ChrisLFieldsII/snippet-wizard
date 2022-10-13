import {
  HStack,
  Link as ChakraLink,
  Tag,
  TagLeftIcon,
  TagLabel,
} from '@chakra-ui/react'

import { SERVICES_MAP } from '~/app-constants'
import { UISnippet } from '~/types'
import { getEntries } from '~/utils'

type ServiceBadgesProps = {
  servicesMap: UISnippet['servicesMap']
}

export const ServiceBadges = ({ servicesMap }: ServiceBadgesProps) => {
  return (
    <HStack>
      {getEntries(servicesMap).map(([svc]) => {
        const mapping = servicesMap[svc]
        return (
          <ChakraLink key={svc} href={mapping.url} isExternal>
            <Tag>
              <TagLeftIcon boxSize="12px" as={SERVICES_MAP[svc].Icon} />
              <TagLabel>{svc}</TagLabel>
            </Tag>
          </ChakraLink>
        )
      })}
    </HStack>
  )
}
