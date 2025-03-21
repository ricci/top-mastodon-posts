import { Table, Thead, Tbody, Tr, Td } from "@chakra-ui/react";
import { MastodonStatus } from "@/types";

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
    const formatter = new Intl.NumberFormat();

    if (statuses !== undefined) {
        for (const status of statuses.sort((a,b) => b.reblogs_count - a.reblogs_count)){
            totalBoosts += status.reblogs_count;
            totalFavs += status.favourites_count;
            if (bIndex +1 <= status.reblogs_count) {
                bIndex = bIndex +1;
            }
        }
        for (const status of statuses.sort((a,b) => b.favourites_count - a.favourites_count)){
            if (fIndex +1 <= status.favourites_count) {
                fIndex = fIndex +1;
            }
        }

        const recentStatuses = statuses.filter(s => new Date(s.created_at).getFullYear() === thisYear.getFullYear());
        for (const status of recentStatuses.sort((a,b) => b.reblogs_count - a.reblogs_count)) {
            totalBoosts1y += status.reblogs_count;
            totalFavs1y += status.favourites_count;
            if (bIndex1y +1 <= status.reblogs_count) {
                bIndex1y = bIndex1y +1;
            }
        }
        for (const status of recentStatuses.sort((a,b) => b.favourites_count - a.favourites_count)) {
            if (fIndex1y +1 <= status.favourites_count) {
                fIndex1y = fIndex1y +1;
            }
        }

    }
    
    return(<Table>
              <Thead>
                  <Tr>
                    <Td>Cited by</Td>
                    <Td textAlign="right">All</Td>
                    <Td textAlign="right">{thisYear.getFullYear()}</Td>
                  </Tr>
              </Thead>
              <Tbody>
                  <Tr>
                    <Td>Citations</Td>
                    <Td textAlign="right">{formatter.format(totalBoosts)}</Td>
                    <Td textAlign="right">{formatter.format(totalBoosts1y)}</Td>
                  </Tr>
                  <Tr>
                    <Td>b-Index</Td>
                    <Td textAlign="right">{formatter.format(bIndex)}</Td>
                    <Td textAlign="right">{formatter.format(bIndex1y)}</Td>
                  </Tr>
                  <Tr>
                    <Td>f-Index</Td>
                    <Td textAlign="right">{formatter.format(fIndex)}</Td>
                    <Td textAlign="right">{formatter.format(fIndex1y)}</Td>
                  </Tr>
              </Tbody>
           </Table>);
}
