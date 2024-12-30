import { MastodonStatus } from "@/types";
import {
    Table,
    Text,
    Thead,
    Tbody,
    Tr,
    Td
} from "@chakra-ui/react";
import { MastodonStatusRow } from "@/components";

export default function MastodonStatusTable({
    statuses,
    isLoading,
    crimeMode,
    extra
}: {
    statuses: Array<MastodonStatus> | undefined;
    isLoading: boolean;
    crimeMode: boolean;
    extra: any;
}) {
    return(
        <Table>
            <Thead>
                <Tr>
                  <Td><Text>Title {extra}</Text></Td>
                  <Td>Citations</Td>
                  <Td>Year</Td>
                </Tr>
            </Thead>
            <Tbody>
                {statuses && statuses.sort((a,b) => b.reblogs_count - a.reblogs_count).slice(0,100).map(x => <MastodonStatusRow key={x.id} status={x} isLoading={isLoading} crimeMode={crimeMode}/>)}
            </Tbody>
        </Table>
    );
}
