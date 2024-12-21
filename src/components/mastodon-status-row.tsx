import { MastodonStatus } from "@/types";
import {
    Tr,
    Td,
    Link
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import truncate from 'truncate-html';
import { useCriminalizeTitle, useCriminalizeVenue } from "@/hooks";

const formatter = new Intl.NumberFormat();

export default function MastodonStatusRow({
    status
}: {
    status: MastodonStatus;
}) {
    const post = status.content;
    const { data: crimTitle } = useCriminalizeTitle({ post });
    const { data: crimVenue } = useCriminalizeVenue({ post });
    return(
        <Tr>
          <Td><Link href={status.url}>{
                (crimTitle && crimVenue)?
                    crimTitle.response + " in " + crimVenue.response
                : parse(truncate(status.content,100))}
               </Link></Td>
          <Td textAlign="right">{formatter.format(status.reblogs_count)}</Td>
          <Td>{new Date(status.created_at).getFullYear()}</Td>
        </Tr>
    );
}
