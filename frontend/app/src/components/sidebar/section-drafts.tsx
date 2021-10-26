import {SectionItem} from 'frontend/app/src/components/sidebar/section-item'
import {Link} from 'wouter'
import {useDraftsList} from '../../hooks'
import {Section} from './section'

export function DraftsSection() {
  const {data = [], status} = useDraftsList()

  return (
    <Section title="Drafts" disabled={status != 'success'}>
      {!!data.length
        ? data.map(({document}) => (
            <Link key={document?.id} href={`/editor/${document?.id}`}>
              <SectionItem isDraft href={`/editor/${document?.id}`} document={document} />
            </Link>
          ))
        : null}
    </Section>
  )
}
