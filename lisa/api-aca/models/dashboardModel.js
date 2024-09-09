const pool = require('./connectModel')

const getDashOne = async (req, res) => {
	let query = {
        text: `
            SELECT 
                v_type,
                count(*) total
            FROM items a
            GROUP BY v_type
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {console.log(err);throw err})
}

const getDashTwo = async (req, res) => {
	let query = {
        text: `
        SELECT
            b.v_user,
            count(*) total
        FROM items_group a
        INNER JOIN users b
            ON a.i_iduser_created=b.i_iduser
        GROUP BY b.v_user
        `,

        values: [],
        }

        return pool()
        .query(query)
        .then(response => response)
        .catch(err => {console.log(err);throw err})
}

const getDashThree = () => {
    let query = {
        text: `
        SELECT 
            SUM(case when b.v_type = 'EGRESO' THEN 1 ELSE 0 END) as expenses,
            SUM(case when b.v_type = 'INGRESO' THEN 1 ELSE 0 END) as ingress,
            SUM(case when b.v_type = 'MERMA' THEN 1 ELSE 0 END) as loss,
            COUNT(DISTINCT a.i_idgroup) movement
        FROM items_group a
        INNER JOIN items b
            ON a.i_idgroup=b.i_idgroup
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

const getDashFour = () => {
    let query = {
        text: `
        SELECT 
            a.i_idgroup,
            a.d_created_at::timestamp(0)::text,
            a.v_type,
            count(*) val,
            c.v_description origin,
            d.v_description destination,
            e.v_names ||' '|| e.v_surnames as fullname,
            e.i_iduser_level,
            a.v_ppu, 
            a.t_observation,
            a.j_evidence::text,
            a.v_type_pallet
        FROM items_group a
        INNER JOIN items b
            ON a.i_idgroup=b.i_idgroup
        INNER JOIN branch c
            ON a.i_idorigin=c.i_idbranch
        INNER JOIN branch d
            ON a.i_iddestination=d.i_idbranch
        INNER JOIN users e
            ON a.i_iduser_created=e.i_iduser
        GROUP BY a.i_idgroup,a.d_created_at::timestamp(0)::text,a.v_type, c.v_description, d.v_description, e.v_names, e.v_surnames, e.i_iduser_level, a.v_ppu, a.t_observation, a.j_evidence::text,a.v_type_pallet
        `,

        values: [],
    }

    return pool()
    .query(query)
    .then(response => response)
    .catch(err => {console.log(err);throw err})
}

module.exports = {
    getDashOne,
    getDashTwo,
    getDashThree,
    getDashFour
}