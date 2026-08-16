import { Box, HStack, Table, Text, Thead, Tbody, Tooltip, Tr, Td } from "@chakra-ui/react";
import { MastodonStatus, RankingMetric } from "@/types";
import { metricTooltip } from "@/library";
import { LuCircleHelp } from "react-icons/lu";

export default function MastodonProfile({
    statuses,
    metric,
    onToggleMetric
}: {
    statuses: Array<MastodonStatus> | undefined;
    metric: RankingMetric;
    onToggleMetric: () => void;
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
                    <Td></Td>
                    <Td textAlign="right">All</Td>
                    <Td textAlign="right">{thisYear.getFullYear()}</Td>
                  </Tr>
              </Thead>
              <Tbody>
                  <Tr>
                    <Td>
                      <Tooltip label={metricTooltip(metric)}>
                        <HStack gap={1} display="inline-flex" cursor="pointer" onClick={onToggleMetric}>
                          <Text>Citations</Text>
                          <Box as="span" display="inline-flex"><LuCircleHelp size={14} /></Box>
                        </HStack>
                      </Tooltip>
                    </Td>
                    <Td textAlign="right">{formatter.format(metric === "boosts" ? totalBoosts : totalFavs)}</Td>
                    <Td textAlign="right">{formatter.format(metric === "boosts" ? totalBoosts1y : totalFavs1y)}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <HStack gap={1} display="inline-flex">
                        <Text>b-Index</Text>
                        <Tooltip label="h-index, but for boosts">
                          <Box as="span" display="inline-flex"><LuCircleHelp size={14} /></Box>
                        </Tooltip>
                      </HStack>
                    </Td>
                    <Td textAlign="right">{formatter.format(bIndex)}</Td>
                    <Td textAlign="right">{formatter.format(bIndex1y)}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <HStack gap={1} display="inline-flex">
                        <Text>f-Index</Text>
                        <Tooltip label="h-index, but for favorites">
                          <Box as="span" display="inline-flex"><LuCircleHelp size={14} /></Box>
                        </Tooltip>
                      </HStack>
                    </Td>
                    <Td textAlign="right">{formatter.format(fIndex)}</Td>
                    <Td textAlign="right">{formatter.format(fIndex1y)}</Td>
                  </Tr>
              </Tbody>
           </Table>);
}
