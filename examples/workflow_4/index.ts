import Nishan, { CollectionViewPage, Page } from '@nishans/core';
import '../env';
import { v4 as uuidv4 } from 'uuid';

const months = [
	[ 'January', 31 ],
	[ 'February', 29 ],
	[ 'March', 31 ],
	[ 'April', 30 ],
	[ 'May', 31 ],
	[ 'June', 30 ],
	[ 'July', 31 ],
	[ 'August', 30 ],
	[ 'September', 31 ],
	[ 'October', 30 ],
	[ 'November', 31 ],
	[ 'December', 30 ]
] as [string, number][];

(async function () {
	const nishan = new Nishan({
		token: process.env.NOTION_TOKEN as string
	});

	const user = await nishan.getNotionUser((user) => user.family_name === 'Shaheer');
	const space = await user.getSpace((space) => space.name === 'Developers');
	const { page } = await space.getTRootPage(
		(root_page) => root_page.type === 'page' && root_page.properties.title[0][0] === 'Hello'
	);

	const target_page = page.get('Hello');

	if (target_page) {
		const { collection_view_page } = await target_page.getBlocks((block) => block.type === 'collection_view_page');
		const getCollectionId = (title: string) =>
			(collection_view_page.get(title) as CollectionViewPage).getCachedData().collection_id;

		const articles_cvp_id = getCollectionId('Articles'),
			daily_cvp_id = getCollectionId('Daily'),
			tasks_cvp_id = getCollectionId('Tasks');

		const { page } = await target_page.createBlocks([
			{
				type: 'page',
				properties: {
					title: [ [ 'Yearly Overview' ] ]
				},
				format: {
					page_full_width: true
				},
			}
    ]);
    
    const yearly_page = page.get("Yearly Overview");
    if(yearly_page){
      for (let year = 2020; year <= 2021; year++) {
        const month_page_uuids = Array(12).fill(null).map(() => uuidv4())
      
        const objfn = (name: string) => ({ name, type: "checkbox" as const, format: [true, 100] as [boolean, number] });
        const {page} = await yearly_page.createBlocks([
          {
						type: 'page',
						properties: {
							title: [ [ year.toString() ] ]
						},
						format: {
							page_full_width: true
            },
					},
        ]);

        const year_page = page.get(year.toString());
        if(year_page){
          for (let index = 0; index < month_page_uuids.length; index++) {
            const month_page_uuid = month_page_uuids[index], [month_name, month_days] = months[index], day_page_uuids = Array(month_days).fill(null).map(() => uuidv4())
            await year_page.createBlocks([{
              id: month_page_uuid,
              type: "page",
              format: {
                page_full_width: true
              },
              properties: {
                title: [[month_name]]
              },
              // contents: Array(month_days).fill(null).map((_, i) => {
              //   const previous_id = day_page_uuids[i === 0 ? month_days - 1 : i - 1], next_id = day_page_uuids[i === month_days - 1 ? 0 : i + 1];
              //   i += 1;
              //   const date = `${year}-${index + 1}-${i < 10 ? "0" + i : i}`;
              //   return {
              //     id: day_page_uuids[i - 1],
              //     type: "page",
              //     properties: {
              //       title: [[`Day ${i}`]]
              //     },
              //     format: {
              //       page_icon: "☝️",
              //       page_full_width: true
              //     },
              //     contents: [
              //       {
              //         type: "column_list",
              //         contents: [
              //           {
              //             type: "link_to_page",
              //             page_id: previous_id
              //           },
              //           {
              //             type: "link_to_page",
              //             page_id: next_id
              //           },
              //         ]
              //       },
              //       {
              //         type: "linked_db",
              //         collection_id: daily_cvp_id,
              //         views: [
              //           {
              //             // You can modify the view type, name etc
              //             type: "table",
              //             name: "Table View",
              //             view: [
              //               // This is the order the properties will be stored in the view
              //               {
              //                 type: "title",
              //                 name: "Date",
              //                 filters: [{
              //                   operator: "string_is",
              //                   type: "exact",
              //                   value: date
              //                 }],
              //                 format: [true, 150],
              //               },
              //               objfn("Github"),
              //               objfn("GMail"),
              //               objfn("Twitter"),
              //               objfn("Codepen"),
              //               objfn("Youtube"),
              //               objfn("Reddit"),
              //               objfn("Stack Overflow"),
              //               objfn("Hashnode"),
              //               objfn("Dev.to"),
              //               objfn("Medium"),
              //               objfn("Stackshare"),
              //               objfn("Percentage"),
              //               {
              //                 type: "number",
              //                 name: "Total",
              //                 format: false
              //               }
              //             ]
              //           }
              //         ]
              //       }, 
              //       // {
              //       //   type: "linked_db",
              //       //   collection_id: collection_ids["Tasks"],
              //       //   views: [
              //       //     {
              //       //       type: "table",
              //       //       name: "Task Table",
              //       //       view: [
              //       //         {
              //       //           // Add your specific sort, filter, format and aggregation
              //       //           type: "date",
              //       //           name: "On",
              //       //           sort: "ascending",
              //       //           filters: [
              //       //             {
              //       //               operator: "date_is",
              //       //               type: "exact",
              //       //               value: {
              //       //                 start_date: date,
              //       //                 type: "date"
              //       //               }
              //       //             }
              //       //           ],
              //       //           format: [true, 250]
              //       //         },
              //       //         {
              //       //           type: "formula",
              //       //           name: "Progress 1",
              //       //           format: [true, 150],
              //       //           aggregation: "count"
              //       //         },
              //       //         {
              //       //           type: "formula",
              //       //           name: "Progress 2",
              //       //           format: [true, 150],
              //       //           aggregation: "count"
              //       //         },
              //       //         {
              //       //           type: "formula",
              //       //           name: "Progress 3",
              //       //           format: [true, 150],
              //       //           aggregation: "count"
              //       //         },
              //       //         {
              //       //           type: "title",
              //       //           name: "Task",
              //       //           format: [true, 250],
              //       //           aggregation: "count"
              //       //         },
              //       //         { name: "Purpose", type: "select", format: [true, 150], aggregation: "unique" },
              //       //         { name: "Subject", type: "select", format: [true, 350], aggregation: "unique" },
              //       //         { name: "Source", type: "select", format: [true, 150], aggregation: "unique" },
              //       //         { name: "Goals 1", type: "relation", format: [true, 300] },
              //       //         { name: "Steps 1", type: "number", format: [true, 150] },
              //       //         { name: "Goals 2", type: "relation", format: [true, 300] },
              //       //         { name: "Steps 2", type: "number", format: [true, 150] },
              //       //         { name: "Goals 3", type: "relation", format: [true, 300] },
              //       //         { name: "Steps 3", type: "number", format: [true, 150] },
              //       //       ]
              //       //     }
              //       //   ]
              //       // }, 
              //       // {
              //       //   type: "linked_db",
              //       //   collection_id: collection_ids["Todo"],
              //       //   views: [
              //       //     {
              //       //       type: "table",
              //       //       name: "Table View",
              //       //       view: [
              //       //         {
              //       //           name: "Todo",
              //       //           format: [true, 300],
              //       //           aggregation: "count",
              //       //           type: "title"
              //       //         },
              //       //         {
              //       //           name: "Done",
              //       //           format: false,
              //       //           filters: [{
              //       //             type: "exact",
              //       //             operator: "checkbox_is",
              //       //             value: true 
              //       //           }],
              //       //           type: "checkbox"
              //       //         },
              //       //         {
              //       //           name: "Priority",
              //       //           format: [true, 150],
              //       //           aggregation: "unique",
              //       //           type: "select"
              //       //         },
              //       //         {
              //       //           name: "Difficulty",
              //       //           format: [true, 150],
              //       //           aggregation: "unique",
              //       //           type: "select"
              //       //         },
              //       //         {
              //       //           name: "Completed At",
              //       //           format: false,
              //       //           sort: "descending",
              //       //           filters: [{operator: "date_is", type: "exact", value: {
              //       //             start_date: date,
              //       //             type: "date"
              //       //           }}],
              //       //           type: "date"
              //       //         },
              //       //         {
              //       //           name: "Priority Order",
              //       //           format: false,
              //       //           sort: "descending",
              //       //           type: "formula"
              //       //         },
              //       //         {
              //       //           name: "Difficulty Order",
              //       //           format: false,
              //       //           sort: "descending",
              //       //           type: "formula"
              //       //         }
              //       //       ]
              //       //     }
              //       //   ]
              //       // }, 
              //       // {
              //       //   type: "linked_db",
              //       //   collection_id: collection_ids["Articles"],
              //       //   views: [
              //       //     {
              //       //       filter_operator: "or",
              //       //       type: "table",
              //       //       name: "Article Table",
              //       //       view: [
              //       //         {
              //       //           name: "Title",
              //       //           format: 250,
              //       //           aggregation: "count",
              //       //           type: "title"
              //       //         },
              //       //         {
              //       //           name: "Urgency",
              //       //           format: 50,
              //       //           sort: "descending",
              //       //           aggregation: "average",
              //       //           type: "number"
              //       //         },
              //       //         {
              //       //           name: "Completed",
              //       //           format: 50,
              //       //           aggregation: "percent_checked",
              //       //           type: "formula"
              //       //         },
              //       //         {
              //       //           name: "Subject",
              //       //           format: 150,
              //       //           aggregation: "unique",
              //       //           type: "multi_select"
              //       //         },
              //       //         {
              //       //           name: "Provider",
              //       //           format: 150,
              //       //           aggregation: "unique",
              //       //           type: "select"
              //       //         },
              //       //         {
              //       //           name: "Source",
              //       //           format: 350,
              //       //           type: "url"
              //       //         },
              //       //         {
              //       //           name: "Priority",
              //       //           format: 150,
              //       //           aggregation: "unique",
              //       //           type: "select"
              //       //         },
              //       //         {
              //       //           name: "Status",
              //       //           format: 150,
              //       //           aggregation: "unique",
              //       //           type: "select"
              //       //         },
              //       //         {
              //       //           name: "Phase",
              //       //           format: 150,
              //       //           aggregation: "unique",
              //       //           type: "select"
              //       //         },
              //       //         {
              //       //           name: "Learn Range",
              //       //           format: 150,
              //       //           aggregation: "percent_not_empty",
              //       //           filters: [{operator: "date_is", type: "exact", value: {
              //       //             type: "date",
              //       //             start_date: date
              //       //           }}],
              //       //           type: "date"
              //       //         },
              //       //         {
              //       //           name: "Revise Range",
              //       //           format: 150,
              //       //           aggregation: "percent_not_empty",
              //       //           filters: [{operator: "date_is", type: "exact", value: {
              //       //             type: "date",
              //       //             start_date: date
              //       //           }}],
              //       //           type: "date"
              //       //         },
              //       //         {
              //       //           name: "Practice Range",
              //       //           format: 150,
              //       //           aggregation: "percent_not_empty",
              //       //           filters: [{operator: "date_is", type: "exact", value: {
              //       //             type: "date",
              //       //             start_date: date
              //       //           }}],
              //       //           type: "date"
              //       //         },
              //       //         {
              //       //           name: "Priority Counter",
              //       //           format: false,
              //       //           type: "formula"
              //       //         },
              //       //         {
              //       //           name: "Status Counter",
              //       //           format: false,
              //       //           type: "formula"
              //       //         },
              //       //         {
              //       //           name: "Phase Counter",
              //       //           format: false,
              //       //           type: "formula"
              //       //         },
              //       //       ]
              //       //     }
              //       //   ]
              //       // }
              //     ]
              //   }
              // })
            }])
            console.log(`Done with ${month_name}, ${year}`)
          };
        }
        await year_page.executeOperation();
      }
    }
	}
})();
