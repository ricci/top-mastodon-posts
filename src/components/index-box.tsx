import { Table, Thead, Tbody, Tr, Td } from "@chakra-ui/react";
import { MastodonStatus } from "@/types";
import {
    HStack,
    Text
} from "@chakra-ui/react";

export default function MastodonProfile({
    statuses
}: {
    statuses: Array<MastodonStatus> | undefined;
}) {
    let bIndex: number = 0;
    let fIndex: number = 0;
    let totalBoosts: number = 0;
    let totalFavs: number = 0;
    let bIndex1y: number = 0;
    let fIndex1y: number = 0;
    let totalBoosts1y: number = 0;
    let totalFavs1y: number = 0;
    const thisYear = new Date();
    // Note: assumes that statuses are sorted
    if (statuses !== undefined) {
        for (const status of statuses){
            totalBoosts += status.reblogs_count;
            totalFavs += status.favourites_count;
            if (bIndex +1 <= status.reblogs_count) {
                bIndex = bIndex +1;
            }
            if (fIndex +1 <= status.favourites_count) {
                fIndex = fIndex +1;
            }
        }
        for (const status of statuses.filter(s => new Date(s.created_at).getFullYear() === thisYear.getFullYear())){
            totalBoosts1y += status.reblogs_count;
            totalFavs1y += status.favourites_count;
            if (bIndex1y +1 <= status.reblogs_count) {
                bIndex1y = bIndex1y +1;
            }
            if (fIndex1y +1 <= status.favourites_count) {
                fIndex1y = fIndex1y +1;
            }
        }

    }
    
    return(<Table>
              <Thead>
                  <Tr>
                    <Td>Cited by</Td>
                    <Td>All</Td>
                    <Td>{thisYear.getFullYear()}</Td>
                  </Tr>
              </Thead>
              <Tbody>
                  <Tr>
                    <Td>Citations</Td>
                    <Td>{totalBoosts}</Td>
                    <Td>{totalBoosts1y}</Td>
                  </Tr>
                  <Tr>
                    <Td>b-Index</Td>
                    <Td>{bIndex}</Td>
                    <Td>{bIndex1y}</Td>
                  </Tr>
                  <Tr>
                    <Td>f-Index</Td>
                    <Td>{fIndex}</Td>
                    <Td>{fIndex1y}</Td>
                  </Tr>
              </Tbody>
           </Table>);
}
