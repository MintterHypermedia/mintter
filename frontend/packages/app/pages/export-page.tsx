import {
  HMAccount,
  HMBlockNode,
  HMPublication,
  getDocumentTitle,
  toHMBlock,
} from '@mintter/shared'
import {
  Button,
  Check,
  Checkbox,
  Container,
  SizableText,
  XStack,
  YStack,
} from '@mintter/ui'
import {useEffect, useMemo, useState} from 'react'
import {useAppContext} from '../app-context'
import {MainWrapper} from '../components/main-wrapper'
import {useAllAccounts, useMyAccount} from '../models/accounts'
import {useAccountPublications} from '../models/documents'
import {convertBlocksToMarkdown} from '../utils/blocks-to-markdown'
import {useNavRoute} from '../utils/navigation'

export default function ExportPage() {
  const [documents, setDocuments] = useState<HMPublication[]>([])
  const [allSelected, setAllSelected] = useState(false)
  const {exportDocuments} = useAppContext()

  useEffect(() => {
    console.log(documents)
  }, [documents])

  const route = useNavRoute()
  if (route.key !== 'export') throw new Error('invalid route')

  const myAccount = useMyAccount()
  const publications = useAccountPublications(myAccount.data?.id)
  const accounts = useAllAccounts()

  const data = useMemo(() => {
    function lookupAccount(accountId: string | undefined) {
      return (
        (accountId &&
          accounts.data?.accounts.find((acc) => acc.id === accountId)) ||
        accountId
      )
    }
    return publications.data?.publications
      .sort((a, b) => {
        const aTime = a?.document?.publishTime
          ? new Date(a?.document?.publishTime).getTime()
          : undefined
        const bTime = b?.document?.publishTime
          ? new Date(b?.document?.publishTime).getTime()
          : undefined
        if (!aTime || !bTime) return 0
        return bTime - aTime
      })
      .map((pub) => {
        return {
          publication: pub,
          author: lookupAccount(pub?.document?.author),
          editors: pub?.document?.editors?.map(lookupAccount) || [],
        }
      })
  }, [publications.data, accounts.data])

  const ExportDocumentListItem = ({
    publication,
    author,
    allSelected,
  }: {
    publication: HMPublication
    author: HMAccount | string | undefined
    allSelected: boolean
  }) => {
    const title = getDocumentTitle(publication.document)
    const [checked, setChecked] = useState(allSelected)

    useEffect(() => {
      setChecked(
        documents.some((doc) => doc.document?.id === publication.document?.id),
      )
    }, [documents, publication.document?.id, allSelected])

    const handleCheckedChange = (isChecked) => {
      if (isChecked) {
        setDocuments([...documents, publication])
      } else {
        setDocuments((prevDocuments) =>
          prevDocuments.filter(
            (doc) => doc.document?.id !== publication.document?.id,
          ),
        )
      }
      setChecked(isChecked)
    }

    return (
      <XStack
        marginVertical="$2"
        w="100%"
        maxWidth={900}
        group="item"
        justifyContent="flex-start"
      >
        <Checkbox
          size="$3"
          borderColor="$color12"
          checked={checked}
          onCheckedChange={handleCheckedChange}
        >
          <Checkbox.Indicator>
            <Check />
          </Checkbox.Indicator>
        </Checkbox>
        <SizableText
          fontSize="$4"
          fontWeight="800"
          textAlign="left"
          marginLeft="$3"
        >
          {title}
        </SizableText>
      </XStack>
    )
  }

  const handleSelectAllChange = (checked) => {
    if (checked) {
      const allDocs = data!.map((result) => result.publication)
      setDocuments(allDocs)
    } else {
      setDocuments([])
    }
    setAllSelected(checked)
  }

  const submitExportDocuments = async () => {
    const documentsToExport = await Promise.all(
      documents.map(async (doc) => {
        const blocks: HMBlockNode[] | undefined = doc.document?.children
        const editorBlocks = toHMBlock(blocks)
        const markdown = await convertBlocksToMarkdown(editorBlocks)
        return {
          title: getDocumentTitle(doc.document),
          markdown,
        }
      }),
    )

    exportDocuments(documentsToExport)
  }

  return (
    <MainWrapper>
      <Container justifyContent="center">
        <SizableText fontWeight="800" fontSize="$9" marginBottom="$8">
          Export your documents
        </SizableText>
        <YStack margin="$1.5" w="100%">
          <XStack
            marginBottom="$5"
            w="100%"
            maxWidth={900}
            group="item"
            justifyContent="flex-start"
          >
            <Checkbox
              size="$3"
              borderColor="$color12"
              checked={allSelected}
              onCheckedChange={handleSelectAllChange}
            >
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
            <SizableText
              fontSize="$4"
              fontWeight="800"
              textAlign="left"
              marginLeft="$3"
            >
              Select All
            </SizableText>
          </XStack>
          {data?.map((result) => {
            return (
              <ExportDocumentListItem
                key={result.publication.document?.id}
                publication={result.publication}
                author={result.author}
                allSelected={allSelected}
              />
            )
          })}
          <Button
            marginTop="$3"
            width="$20"
            onPress={() => {
              submitExportDocuments()
            }}
          >{`Export ${documents.length} documents`}</Button>
        </YStack>
      </Container>
    </MainWrapper>
  )
}