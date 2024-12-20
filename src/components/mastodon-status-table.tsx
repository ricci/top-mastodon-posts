import { MastodonStatus } from "@/types";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Td
} from "@chakra-ui/react";
import { MastodonStatusRow } from "@/components";

export default function MastodonStatusTable({
    statuses
}: {
    statuses: Array<MastodonStatus> | undefined;
}) {
    return(
        <Table>
            <Thead>
                <Tr>
                  <Td>Title</Td>
                  <Td>Citations</Td>
                  <Td>Year</Td>
                </Tr>
            </Thead>
            <Tbody>
                {statuses && statuses.sort((a,b) => b.reblogs_count - a.reblogs_count).slice(0,100).map(x => <MastodonStatusRow status={x}/>)}
            </Tbody>
        </Table>
    );
}
