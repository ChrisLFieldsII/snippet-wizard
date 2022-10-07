/** tag for a snippet service */
export type ServiceTag = 'gitlab' | 'github'

export type ServiceConfig = {
  token: string
}

export type ServicesMap = Record<ServiceTag, ServiceConfig>
