class QueryApi {
    constructor(query, queryObject) {
        this.query = query
        this.queryObject = queryObject
    }

    filter() {
        const queryObject = {...this.queryObject}

        const reservedQuery = ['fields', 'sort', 'page', 'limit']

        reservedQuery.forEach((item) => {
            delete queryObject[item]
        })

        const queryStr = JSON.stringify(queryObject).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr))
        return this
    }

    sort() {
        if(this.queryObject.sort) {
            const sortBy = this.queryObject.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else {
            this.query = this.query.sort('-__createdAt')
        }
        return this
    }

    limitFields() {
        if(this.queryObject.fields) {
            const fields = this.queryObject.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    pagination() {
        const page = parseInt(this.queryObject.page) || 1
        const limit = parseInt(this.queryObject.limit) || 2

        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = QueryApi