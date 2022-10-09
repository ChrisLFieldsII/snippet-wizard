export default async ({ args }) => {
  console.log(':: Executing script with args ::')
  console.log(args)
  console.log(process.env.GITHUB_PAT)
  console.log(process.env.GITLAT_PAT)
}
