import { Client, ID, Query, TablesDB } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

const database = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await database.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.equal('searchTerm', searchTerm)
            ]
        });

        if (result.rows.length > 0) {
            const row = result.rows[0];

            await database.updateRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: row.$id,
                data: {
                    count: row.count + 1
                }
            });

        } else {
            await database.createRow({
                databaseId: DATABASE_ID,
                tableId: TABLE_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            });
        }

    } catch (error) {
        console.error('Appwrite error:', error);
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.limit(5),
                Query.orderDesc("count")
            ]
        });

        return result.rows;

    } catch (error) {
        console.error(error);
    }
};