import { MastodonStatus } from "@/types";
import {
    Tr,
    Td,
    Link
} from "@chakra-ui/react";
import parse from 'html-react-parser';
import truncate from 'truncate-html';

const formatter = new Intl.NumberFormat();

export default function MastodonStatusRow({
    status
}: {
    status: MastodonStatus;
}) {
    return(
        <Tr>
          <Td><Link href={status.url}>{parse(truncate(status.content,100))}</Link></Td>
          <Td>{formatter.format(status.reblogs_count)}</Td>
          <Td>{new Date(status.created_at).getFullYear()}</Td>
        </Tr>
    );
}
